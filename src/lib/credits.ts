import { createServiceClient } from "./supabase-server";

// ─── Fixed Credit Economy (Following Mascot Strategy) ──────────────────────
export const ACTION_COSTS: Record<string, number> = {
    restyle: 5,     // Standard full room redesign
    paint: 3,       // Specific wall color change
    refine: 3,      // Iterative follow-up editing
    variations: 10, // Generating 4 different directions (Bulk)
    moodboard: 1,   // Text-only design extraction
    suggestions: 1, // AI-generated design refinements
};

export function getActionCost(action: string): number {
    return ACTION_COSTS[action] || 1;
}

// ─── Get user's current credit balance ───────────────────────────────────────
export async function getUserCredits(userId: string): Promise<number> {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("id", userId)
        .single();

    if (error || !data) return 0;
    return data.credits;
}

// ─── Check if user has enough credits ────────────────────────────────────────
export async function hasEnoughCredits(
    userId: string,
    amount: number = 1
): Promise<boolean> {
    const credits = await getUserCredits(userId);
    return credits >= amount;
}

// ─── Deduct credits atomically ───────────────────────────────────────────────
export async function deductCredits(
    userId: string,
    amount: number,
    description: string
): Promise<{ success: boolean; remaining: number }> {
    const supabase = await createServiceClient();

    // Use a transaction-like approach: check & deduct
    const { data: current, error: fetchError } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("id", userId)
        .single();

    if (fetchError || !current || current.credits < amount) {
        return { success: false, remaining: current?.credits ?? 0 };
    }

    const newBalance = current.credits - amount;

    const { error: updateError } = await supabase
        .from("user_credits")
        .update({
            credits: newBalance,
            lifetime_credits_used: (current as { credits: number; lifetime_credits_used?: number }).lifetime_credits_used
                ? (current as { credits: number; lifetime_credits_used: number }).lifetime_credits_used + amount
                : amount,
        })
        .eq("id", userId)
        .gte("credits", amount); // Optimistic concurrency: only update if still enough

    if (updateError) {
        return { success: false, remaining: current.credits };
    }

    // Log the transaction
    await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: -amount,
        type: "generation",
        description,
    });

    return { success: true, remaining: newBalance };
}

// ─── Add credits ─────────────────────────────────────────────────────────────
export async function addCredits(
    userId: string,
    amount: number,
    type: "signup_bonus" | "subscription" | "manual",
    description: string
): Promise<{ success: boolean; newBalance: number }> {
    const supabase = await createServiceClient();

    const { data: current } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("id", userId)
        .single();

    const currentCredits = current?.credits ?? 0;
    const newBalance = currentCredits + amount;

    const { error } = await supabase
        .from("user_credits")
        .upsert({
            id: userId,
            credits: newBalance,
        });

    if (error) {
        return { success: false, newBalance: currentCredits };
    }

    await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount,
        type,
        description,
    });

    return { success: true, newBalance };
}

// ─── Get credit transaction history ──────────────────────────────────────────
export async function getCreditHistory(
    userId: string,
    limit: number = 50
) {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) return [];
    return data;
}
