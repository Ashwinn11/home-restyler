import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase-server";
import {
    cancelSubscription,
    updateSubscription,
    getPlanByVariantId,
} from "@/lib/lemonsqueezy";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { action, variantId } = await request.json();
        const serviceClient = await createServiceClient();

        // Get user's active subscription
        const { data: subscription } = await serviceClient
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .in("status", ["active", "past_due"])
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!subscription) {
            return NextResponse.json(
                { error: "No active subscription found" },
                { status: 404 }
            );
        }

        switch (action) {
            case "cancel": {
                const result = await cancelSubscription(subscription.ls_subscription_id);
                if (!result) {
                    return NextResponse.json(
                        { error: "Failed to cancel subscription" },
                        { status: 500 }
                    );
                }
                return NextResponse.json({ success: true, message: "Subscription will be cancelled at end of billing period" });
            }

            case "update": {
                if (!variantId) {
                    return NextResponse.json(
                        { error: "variantId required for plan update" },
                        { status: 400 }
                    );
                }

                const plan = getPlanByVariantId(variantId);
                if (!plan) {
                    return NextResponse.json(
                        { error: "Invalid plan variant" },
                        { status: 400 }
                    );
                }

                const result = await updateSubscription(
                    subscription.ls_subscription_id,
                    variantId
                );
                if (!result) {
                    return NextResponse.json(
                        { error: "Failed to update subscription" },
                        { status: 500 }
                    );
                }
                return NextResponse.json({
                    success: true,
                    message: `Subscription updated to ${plan.name}`,
                });
            }

            default:
                return NextResponse.json(
                    { error: "Invalid action. Use 'cancel' or 'update'" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Manage subscription error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
