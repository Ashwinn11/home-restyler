import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
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
