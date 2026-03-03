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
        // Use the webhook_id from Lemon Squeezy (as seen in your payload) or the signature as fallback.
        const webhookId = payload.meta?.webhook_id || signature;
        const supabase = await createServiceClient();

        if (webhookId) {
            const { error: idempotencyError } = await supabase
                .from("processed_webhooks")
                .insert({ webhook_id: webhookId });

            if (idempotencyError) {
                // If the ID already exists, return Success (200) so LS stops retrying,
                // but don't re-process the logic.
                if (idempotencyError.code === "23505") { // unique_violation
                    return NextResponse.json({ received: true, deduplicated: true });
                }
                console.error(`Idempotency table error [${webhookId}]:`, idempotencyError.message);
            } else {
                console.log(`Successfully logged webhook: ${webhookId}`);
            }
        }

        if (!userId) {
            console.error("No user_id in webhook custom data");
            return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
        }

        const attributes = payload.data?.attributes;
        // LS uses the resource ID as payload.data.id. 
        // For invoices, the actual subscription ID is in attributes.
        const resourceId = String(payload.data?.id);
        const subscriptionId = attributes?.subscription_id ? String(attributes.subscription_id) : resourceId;

        const variantId = attributes?.variant_id ? String(attributes.variant_id) : null;
        const status = attributes?.status;

        switch (eventName) {
            case "subscription_created": {
                if (!variantId) {
                    console.error("No variant ID in subscription_created");
                    break;
                }
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

                // NOTE: We don't add credits here anymore. 
                // We wait for 'subscription_payment_success' with billing_reason: 'initial' 
                // to ensure the credit grant only happens after successful payment.
                break;
            }

            case "subscription_plan_changed": {
                if (!variantId) break;
                const plan = getPlanByVariantId(variantId);

                // Fetch current sub to see if the plan is changing
                const { data: currentSub } = await supabase
                    .from("subscriptions")
                    .select("ls_variant_id")
                    .eq("ls_subscription_id", subscriptionId)
                    .maybeSingle();

                if (plan && currentSub) {
                    const oldPlan = getPlanByVariantId(currentSub.ls_variant_id);
                    const isUpgrade = oldPlan && plan.priceCents > oldPlan.priceCents;
                    const isNewVariant = currentSub.ls_variant_id !== variantId;

                    // Grant credits ONLY if it's a price upgrade and its a new variant
                    if (isNewVariant && isUpgrade) {
                        const creditDiff = plan.credits - (oldPlan?.credits || 0);
                        if (creditDiff > 0) {
                            await addCredits(
                                userId,
                                creditDiff,
                                "subscription",
                                `Upgraded to ${plan.name} – ${creditDiff} incremental credits added`
                            );
                        }
                    }

                    // Sync the new plan to DB immediately in this block too
                    await supabase
                        .from("subscriptions")
                        .update({
                            ls_variant_id: variantId,
                            plan_name: plan.slug,
                            credits_per_period: plan.credits,
                            price_cents: plan.priceCents,
                            updated_at: new Date().toISOString()
                        })
                        .eq("ls_subscription_id", subscriptionId);
                }
                break;
            }

            case "subscription_updated": {
                // subscription_updated is now ONLY for metadata sync (status, dates).
                // Credit logic is moved to plan_changed and payment_success.
                const updateData: Record<string, unknown> = {
                    status: mapLsStatus(status),
                    updated_at: new Date().toISOString(),
                };

                if (variantId) {
                    const plan = getPlanByVariantId(variantId);
                    if (plan) {
                        updateData.ls_variant_id = variantId;
                        updateData.plan_name = plan.slug;
                        updateData.credits_per_period = plan.credits;
                        updateData.price_cents = plan.priceCents;
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
                const billingReason = attributes?.billing_reason;

                // For invoices, LS doesn't always send the variant_id in attributes.
                // We fetch it from our DB to be sure.
                let effectiveVariantId = variantId;
                if (!effectiveVariantId) {
                    const { data: existingSub } = await supabase
                        .from("subscriptions")
                        .select("ls_variant_id")
                        .eq("ls_subscription_id", subscriptionId)
                        .maybeSingle();
                    effectiveVariantId = existingSub?.ls_variant_id;
                }

                if (effectiveVariantId) {
                    const plan = getPlanByVariantId(effectiveVariantId);
                    // Match Mascot: grant credits for both 'initial' purchase and 'renewal'
                    if (plan && (billingReason === "initial" || billingReason === "renewal")) {
                        await addCredits(
                            userId,
                            plan.credits,
                            "subscription",
                            `${plan.name} subscription ${billingReason} – ${plan.credits} credits granted`
                        );
                    }
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
