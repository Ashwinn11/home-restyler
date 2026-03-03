import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase-server";
import { createCheckoutUrl, getPlans } from "@/lib/lemonsqueezy";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { planSlug, variantId } = body;

        // Support both planSlug (from client) and variantId (direct)
        let plan;
        const plans = getPlans();

        if (planSlug) {
            plan = plans.find((p) => p.slug === planSlug);
        } else if (variantId) {
            plan = plans.find((p) => p.variantId === variantId);
        }

        if (!plan) {
            return NextResponse.json(
                { error: "Invalid plan" },
                { status: 400 }
            );
        }

        // Check for existing active subscription
        const serviceClient = await createServiceClient();
        const { data: existingSub } = await serviceClient
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .in("status", ["active", "past_due"])
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        // If they have an active plan, handle as an update (proration) instead of a new checkout
        if (existingSub) {
            // Re-using the logic from our manage route but integrated here for a seamless flow
            if (existingSub.ls_variant_id === String(plan.variantId)) {
                return NextResponse.json({ error: "You are already on this plan" }, { status: 400 });
            }

            const { updateSubscription } = await import("@/lib/lemonsqueezy");
            const result = await updateSubscription(
                existingSub.ls_subscription_id,
                String(plan.variantId)
            );

            if (!result) {
                return NextResponse.json(
                    { error: "Failed to update your subscription" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: `Subscription updated to ${plan.name}`,
                isUpdate: true
            });
        }

        const origin = request.headers.get("origin") || "http://localhost:3000";
        const redirectUrl = `${origin}/profile?checkout=success`;

        const checkoutUrl = await createCheckoutUrl(
            user.id,
            user.email || "",
            plan.variantId,
            redirectUrl
        );

        if (!checkoutUrl) {
            return NextResponse.json(
                { error: "Failed to create checkout" },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: checkoutUrl });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
