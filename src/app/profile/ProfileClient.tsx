"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import ConfirmDialog from "@/components/ConfirmDialog";
import PricingSection from "@/components/PricingSection";
import { useSearchParams } from "next/navigation";

interface CreditTransaction {
    id: string;
    amount: number;
    type: string;
    description: string;
    created_at: string;
}

function ProfileContent() {
    const { user, credits, subscription, refreshCredits, refreshSubscription } = useAuth();
    const toast = useToast();
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [loadingTx, setLoadingTx] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const searchParams = useSearchParams();
    const checkoutSuccess = searchParams.get("checkout") === "success";

    useEffect(() => {
        if (checkoutSuccess) {
            refreshCredits();
            refreshSubscription();
            toast.success("Subscription activated!", "Your credits have been added.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkoutSuccess]);

    useEffect(() => {
        if (!user) return;
        const fetchTransactions = async () => {
            try {
                const { createClient } = await import("@/lib/supabase-browser");
                const supabase = createClient();
                const { data } = await supabase
                    .from("credit_transactions")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(20);
                setTransactions(data || []);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setLoadingTx(false);
            }
        };
        fetchTransactions();
    }, [user, credits]);

    const handleCancel = async () => {
        setCancelling(true);
        try {
            const res = await fetch("/api/billing/manage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "cancel" }),
            });
            if (res.ok) {
                await refreshSubscription();
                setShowCancelConfirm(false);
                toast.success("Subscription cancelled", "You'll keep access until the end of your billing period.");
            } else {
                toast.error("Couldn't cancel subscription", "Please try again or contact support.");
            }
        } catch {
            toast.error("Couldn't cancel subscription", "Please try again or contact support.");
        } finally {
            setCancelling(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-ink pt-20 pb-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="" className="h-16 w-16 border-2 border-gold/20 object-cover" />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center bg-gold/10 text-2xl font-bold text-gold">
                            {(user.email?.[0] || "U").toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-parchment">
                            {user.user_metadata?.full_name || "Your Profile"}
                        </h1>
                        <p className="text-sm text-parchment-muted">{user.email}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="border border-parchment-faint/10 bg-ink-raised p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-parchment-faint">Credits Remaining</p>
                        <p className="mt-2 font-display text-4xl font-bold text-gold">{credits}</p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-elevated">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-soft transition-all duration-500"
                                style={{ width: `${Math.min(100, (credits / (subscription?.credits_per_period || 25)) * 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="border border-parchment-faint/10 bg-ink-raised p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-parchment-faint">Current Plan</p>
                        <p className="mt-2 font-display text-4xl font-bold capitalize text-parchment">
                            {subscription?.plan_name || "Free"}
                        </p>
                        <p className="mt-1 text-xs text-parchment-muted">
                            {subscription ? `$${(subscription.price_cents / 100).toFixed(2)}/month` : "25 credits (one-time)"}
                        </p>
                    </div>

                    <div className="border border-parchment-faint/10 bg-ink-raised p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-parchment-faint">
                            {subscription?.cancel_at_period_end ? "Access Until" : "Next Renewal"}
                        </p>
                        <p className="mt-2 font-display text-2xl font-bold text-parchment">
                            {subscription?.current_period_end
                                ? new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                : "—"}
                        </p>
                        {subscription?.cancel_at_period_end && (
                            <p className="mt-1 text-xs text-rose">Cancels at period end</p>
                        )}
                    </div>
                </div>

                {/* Subscription Management */}
                {subscription && (subscription.status === "active" || subscription.status === "cancelled") && (
                    <div className="mb-8 border border-parchment-faint/10 bg-ink-raised p-5">
                        <h2 className="font-display text-lg font-semibold text-parchment">Manage Subscription</h2>
                        <p className="mt-1 text-xs text-parchment-muted">
                            {subscription.cancel_at_period_end
                                ? "Your subscription is set to cancel. You retain access until the end of the billing period."
                                : `You are on the ${subscription.plan_name} plan, renewing ${subscription.current_period_end ? `on ${new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "monthly"}.`}
                        </p>
                        {!subscription.cancel_at_period_end && (
                            <div className="mt-4">
                                <button
                                    onClick={() => setShowCancelConfirm(true)}
                                    className="border border-rose/30 bg-rose/5 px-5 py-2 text-xs font-medium text-rose transition-all hover:bg-rose/15"
                                >
                                    Cancel subscription
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Credit History */}
                <div className="mb-12 border border-parchment-faint/10 bg-ink-raised p-5">
                    <h2 className="font-display text-lg font-semibold text-parchment">Credit History</h2>
                    {loadingTx ? (
                        <div className="mt-4 space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 animate-pulse bg-ink-elevated" />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <p className="mt-4 text-sm text-parchment-muted">No transactions yet.</p>
                    ) : (
                        <div className="mt-4 divide-y divide-parchment-faint/5">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between py-2.5">
                                    <div>
                                        <p className="text-sm text-parchment">{tx.description || tx.type}</p>
                                        <p className="text-[10px] text-parchment-faint">
                                            {new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold ${tx.amount > 0 ? "bg-olive/10 text-olive" : "bg-rose/10 text-rose"}`}>
                                        {tx.amount > 0 ? "+" : ""}{tx.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <PricingSection showFree={false} />
            </div>

            <ConfirmDialog
                open={showCancelConfirm}
                title="Cancel your subscription?"
                description="You'll keep full access to your credits and features until the end of your current billing period. You won't be charged again after that."
                confirmLabel="Yes, cancel"
                cancelLabel="Keep plan"
                destructive
                loading={cancelling}
                onConfirm={handleCancel}
                onCancel={() => setShowCancelConfirm(false)}
            />
        </div>
    );
}

export default function ProfileClient() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-ink">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}
