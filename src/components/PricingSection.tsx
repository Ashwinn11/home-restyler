"use client";

import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import { PLANS, type PlanDisplay } from "@/lib/plans";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

interface PricingSectionProps {
    showFree?: boolean;
}

export default function PricingSection({ showFree = true }: PricingSectionProps) {
    const { user, subscription, openAuthModal } = useAuth();
    const toast = useToast();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [switchConfirm, setSwitchConfirm] = useState<PlanDisplay | null>(null);

    const doCheckout = async (plan: PlanDisplay) => {
        if (!user) {
            openAuthModal();
            return;
        }

        setLoadingPlan(plan.slug);
        try {
            const res = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planSlug: plan.slug }),
            });
            if (!res.ok) throw new Error("Checkout failed");
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch {
            toast.error("Checkout failed", "Please try again or contact support.");
        } finally {
            setLoadingPlan(null);
        }
    };

    const handleCheckout = (plan: PlanDisplay) => {
        if (subscription) {
            setSwitchConfirm(plan);
        } else {
            doCheckout(plan);
        }
    };

    const isCurrentPlan = (plan: PlanDisplay) =>
        subscription?.plan_name === plan.slug && subscription?.status === "active";

    return (
        <>
            <section className="py-16">
                <div className="mx-auto max-w-5xl px-4">
                    <h2 className="text-center font-display text-3xl font-semibold text-parchment md:text-4xl">
                        Choose Your Plan
                    </h2>
                    <p className="mt-3 text-center text-sm text-parchment-muted">
                        Start free with 25 credits. Upgrade anytime for more room transformations.
                    </p>

                    <div className={`mt-12 grid gap-6 ${showFree ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
                        {/* Free Tier */}
                        {showFree && (
                            <div className="relative flex flex-col rounded-2xl border border-parchment-faint/10 bg-ink-raised p-6">
                                <h3 className="font-display text-xl font-semibold text-parchment">
                                    Free
                                </h3>
                                <p className="mt-1 text-xs text-parchment-muted">
                                    Try it out
                                </p>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-parchment">$0</span>
                                </div>
                                <ul className="mt-6 flex-1 space-y-2.5 text-xs text-parchment-muted">
                                    <li className="flex items-start gap-2">
                                        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>
                                        25 credits (one-time)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>
                                        All design styles
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>
                                        Standard downloads
                                    </li>
                                </ul>
                                <div className="mt-6">
                                    {!user ? (
                                        <button
                                            onClick={openAuthModal}
                                            className="block w-full border border-parchment-faint/20 bg-transparent py-2 text-center text-xs font-medium text-parchment-muted hover:bg-ink-elevated transition-colors"
                                        >
                                            Get Started Free
                                        </button>
                                    ) : (
                                        <span className="block w-full border border-parchment-faint/20 bg-transparent py-2 text-center text-xs font-medium text-parchment-muted">
                                            {subscription ? "Free tier" : "Current plan"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Paid Plans */}
                        {PLANS.map((plan) => {
                            const isCurrent = isCurrentPlan(plan);
                            const isPopular = plan.slug === "pro";

                            return (
                                <div
                                    key={plan.slug}
                                    className={`relative flex flex-col rounded-2xl border p-6 transition-all ${isPopular
                                        ? "border-gold/30 bg-gradient-to-b from-gold/5 to-ink-raised shadow-[0_0_40px_rgba(201,168,76,0.06)]"
                                        : "border-parchment-faint/10 bg-ink-raised"
                                        }`}
                                >
                                    {isPopular && (
                                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                                            Most Popular
                                        </span>
                                    )}

                                    <h3 className="font-display text-xl font-semibold text-parchment">
                                        {plan.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-parchment-muted">
                                        {plan.credits.toLocaleString()} credits/month
                                    </p>

                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-parchment">
                                            ${(plan.priceCents / 100).toFixed(2)}
                                        </span>
                                        <span className="text-xs text-parchment-faint">/month</span>
                                    </div>

                                    <ul className="mt-6 flex-1 space-y-2.5 text-xs text-parchment-muted">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2">
                                                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-6">
                                        {isCurrent ? (
                                            <span className="block w-full border border-gold/20 bg-gold/5 py-2 text-center text-xs font-semibold text-gold">
                                                Current Plan
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleCheckout(plan)}
                                                disabled={loadingPlan === plan.slug}
                                                className={`block w-full py-2 text-center text-xs font-semibold transition-all disabled:opacity-50 ${isPopular
                                                    ? "bg-gold text-ink hover:bg-gold-soft"
                                                    : "border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20"
                                                    }`}
                                            >
                                                {loadingPlan === plan.slug
                                                    ? "Loading..."
                                                    : subscription
                                                        ? "Switch Plan"
                                                        : "Get Started"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Plan Switch ConfirmDialog */}
            <ConfirmDialog
                open={!!switchConfirm}
                title={`Switch to ${switchConfirm?.name}?`}
                description={`You'll be redirected to checkout to switch to the ${switchConfirm?.name} plan ($${switchConfirm ? (switchConfirm.priceCents / 100).toFixed(2) : 0}/month). Your current subscription will be updated.`}
                confirmLabel="Continue to checkout"
                loading={!!loadingPlan}
                onConfirm={() => {
                    if (switchConfirm) doCheckout(switchConfirm);
                    setSwitchConfirm(null);
                }}
                onCancel={() => setSwitchConfirm(null)}
            />
        </>
    );
}
