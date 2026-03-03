-- =============================================================================
-- Home Restyler – Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================================================

-- ─── User Credits ────────────────────────────────────────────────────────────
create table if not exists public.user_credits (
  id          uuid primary key references auth.users(id) on delete cascade,
  credits     integer not null default 25,
  lifetime_credits_used integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.user_credits enable row level security;

create policy "Users can view own credits"
  on public.user_credits for select
  using (auth.uid() = id);

create policy "Users can update own credits"
  on public.user_credits for update
  using (auth.uid() = id);

-- ─── Credit Transactions ─────────────────────────────────────────────────────
create table if not exists public.credit_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  amount      integer not null, -- positive = added, negative = used
  type        text not null check (type in ('signup_bonus', 'subscription', 'generation', 'manual')),
  description text,
  created_at  timestamptz not null default now()
);

alter table public.credit_transactions enable row level security;

create policy "Users can view own transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

-- ─── Subscriptions ───────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  ls_subscription_id    text unique not null,
  ls_variant_id         text not null,
  plan_name             text not null check (plan_name in ('starter', 'pro', 'studio')),
  status                text not null default 'active'
                        check (status in ('active', 'cancelled', 'past_due', 'expired', 'paused')),
  credits_per_period    integer not null,
  price_cents           integer not null,
  current_period_end    timestamptz,
  cancel_at_period_end  boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ─── Gallery ─────────────────────────────────────────────────────────────────
create table if not exists public.gallery (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  image_url         text not null,
  original_image_url text,
  title             text not null default 'Untitled',
  style             text,
  metadata          jsonb default '{}',
  created_at        timestamptz not null default now()
);

alter table public.gallery enable row level security;

create policy "Users can view own gallery"
  on public.gallery for select
  using (auth.uid() = user_id);

create policy "Users can insert own gallery"
  on public.gallery for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own gallery"
  on public.gallery for delete
  using (auth.uid() = user_id);

-- ─── Auto-provision credits on signup ────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_credits (id, credits)
  values (new.id, 25);

  insert into public.credit_transactions (user_id, amount, type, description)
  values (new.id, 25, 'signup_bonus', 'Welcome bonus – 25 free credits');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Updated-at trigger helper ───────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_credits_updated_at
  before update on public.user_credits
  for each row execute procedure public.set_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

-- ─── Storage bucket for gallery images ───────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

create policy "Users can upload gallery images"
  on storage.objects for insert
  with check (
    bucket_id = 'gallery-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view gallery images"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

create policy "Users can delete own gallery images"
  on storage.objects for delete
  using (
    bucket_id = 'gallery-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
