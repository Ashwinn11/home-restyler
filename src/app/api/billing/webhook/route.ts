import { NextResponse } from "next/server";
import { verifyWebhookSignature, getPlanByVariantId } from "@/lib/lemonsqueezy";
import { addCredits } from "@/lib/credits";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get("x-signature") || "";

        // Verify webhook signature
        const isValid = await verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            console.error("Invalid webhook signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta?.event_name;
        const customData = payload.meta?.custom_data;
        const userId = customData?.user_id;

        // --- Idempotency Check (Best Practice) ---
        // Use the event ID from Lemon Squeezy to prevent duplicate processing.
        const webhookId = payload.meta?.event_id;
        const supabase = await createServiceClient();

        if (webhookId) {
            const { error: idempotencyError } = await supabase
                .from("processed_webhooks")
                .insert({ webhook_id: webhookId });

            // If the ID already exists, return Success (200) so LS stops retrying,
            // but don't re-process the credits.
            if (idempotencyError && idempotencyError.code === "23505") { // unique_violation
                return NextResponse.json({ received: true, deduplicated: true });
            }
        }

        if (!userId) {
            console.error("No user_id in webhook custom data");
            return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
        }

        const attributes = payload.data?.attributes;
        const subscriptionId = String(payload.data?.id);
        const variantId = String(attributes?.variant_id);
        const status = attributes?.status;

        switch (eventName) {
            case "subscription_created": {
                const plan = getPlanByVariantId(variantId);
                if (!plan) {
                    console.error("Unknown variant ID:", variantId);
                    break;
                }

                // Save subscription
                await supabase.from("subscriptions").upsert({
                    user_id: userId,
                    ls_subscription_id: subscriptionId,
                    ls_variant_id: variantId,
                    plan_name: plan.slug,
                    status: "active",
                    credits_per_period: plan.credits,
                    price_cents: plan.priceCents,
                    current_period_end: attributes?.renews_at,
                    cancel_at_period_end: false,
                }, {
                    onConflict: "ls_subscription_id",
                });

                // Add credits
                await addCredits(
                    userId,
                    plan.credits,
                    "subscription",
                    `${plan.name} plan activated – ${plan.credits} credits`
                );

                break;
            }

            case "subscription_updated": {
                const plan = getPlanByVariantId(variantId);

                // Fetch current sub to see if the plan is changing
                const { data: currentSub } = await supabase
                    .from("subscriptions")
                    .select("ls_variant_id, plan_name")
                    .eq("ls_subscription_id", subscriptionId)
                    .maybeSingle();

                const updateData: Record<string, unknown> = {
                    status: mapLsStatus(status),
                    updated_at: new Date().toISOString(),
                };

                if (plan) {
                    updateData.ls_variant_id = variantId;
                    updateData.plan_name = plan.slug;
                    updateData.credits_per_period = plan.credits;
                    updateData.price_cents = plan.priceCents;

                    // Calculate if this is an Upgrade (compare prices)
                    const oldPlan = currentSub ? getPlanByVariantId(currentSub.ls_variant_id) : null;
                    const isUpgrade = oldPlan && plan.priceCents > oldPlan.priceCents;

                    // Only grant new credits immediately if it's an UPGRADE
                    if (currentSub && currentSub.ls_variant_id !== variantId && isUpgrade) {
                        await addCredits(
                            userId,
                            plan.credits,
                            "subscription",
                            `Upgraded to ${plan.name} – ${plan.credits} credits added`
                        );
                    }
                }

                if (attributes?.renews_at) {
                    updateData.current_period_end = attributes.renews_at;
                }

                updateData.cancel_at_period_end = attributes?.cancelled ?? false;

                await supabase
                    .from("subscriptions")
                    .update(updateData)
                    .eq("ls_subscription_id", subscriptionId);

                break;
            }

            case "subscription_payment_success": {
                // IMPORTANT: Only grant credits on "renewal" payments.
                // Initial creation credits are handled in 'subscription_created'.
                // Upgrades are handled immediately in 'subscription_updated'.
                const plan = getPlanByVariantId(variantId);
                const billingReason = attributes?.billing_reason;

                if (plan && billingReason === "renewal") {
                    await addCredits(
                        userId,
                        plan.credits,
                        "subscription",
                        `${plan.name} subscription renewed – ${plan.credits} credits`
                    );
                }

                // Always update the period end date regardless of billing reason
                await supabase
                    .from("subscriptions")
                    .update({
                        current_period_end: attributes?.renews_at,
                        status: "active",
                    })
                    .eq("ls_subscription_id", subscriptionId);

                break;
            }

            case "subscription_cancelled": {
                await supabase
                    .from("subscriptions")
                    .update({
                        status: "cancelled",
                        cancel_at_period_end: true,
                    })
                    .eq("ls_subscription_id", subscriptionId);
                break;
            }

            case "subscription_expired": {
                await supabase
                    .from("subscriptions")
                    .update({ status: "expired" })
                    .eq("ls_subscription_id", subscriptionId);
                break;
            }

            default:
                console.log("Unhandled webhook event:", eventName);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

function mapLsStatus(status: string): string {
    const map: Record<string, string> = {
        active: "active",
        cancelled: "cancelled",
        past_due: "past_due",
        expired: "expired",
        paused: "paused",
        on_trial: "active",
        unpaid: "past_due",
    };
    return map[status] || status;
}
