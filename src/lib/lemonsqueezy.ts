import {
    lemonSqueezySetup,
    createCheckout,
    getSubscription,
    cancelSubscription as lsCancelSubscription,
    updateSubscription as lsUpdateSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

// ─── Initialize Lemon Squeezy SDK ────────────────────────────────────────────
function initLemonSqueezy() {
    lemonSqueezySetup({
        apiKey: process.env.LEMONSQUEEZY_API_KEY!,
        onError: (error) => console.error("LemonSqueezy error:", error),
    });
}

// ─── Plan Configuration ──────────────────────────────────────────────────────
export interface PlanConfig {
    name: string;
    slug: "starter" | "pro" | "studio";
    credits: number;
    priceCents: number;
    priceLabel: string;
    variantId: string;
    features: string[];
}

export function getPlans(): PlanConfig[] {
    return [
        {
            name: "Starter",
            slug: "starter",
            credits: 100,
            priceCents: 499,
            priceLabel: "$4.99/mo",
            variantId: process.env.LEMONSQUEEZY_VARIANT_STARTER!,
            features: [
                "100 credits/month",
                "All design styles",
                "HD downloads",
                "Gallery storage",
            ],
        },
        {
            name: "Pro",
            slug: "pro",
            credits: 500,
            priceCents: 1999,
            priceLabel: "$19.99/mo",
            variantId: process.env.LEMONSQUEEZY_VARIANT_PRO!,
            features: [
                "500 credits/month",
                "All design styles",
                "HD downloads",
                "Gallery storage",
                "Priority processing",
            ],
        },
        {
            name: "Studio",
            slug: "studio",
            credits: 1500,
            priceCents: 4999,
            priceLabel: "$49.99/mo",
            variantId: process.env.LEMONSQUEEZY_VARIANT_STUDIO!,
            features: [
                "1,500 credits/month",
                "All design styles",
                "HD downloads",
                "Gallery storage",
                "Priority processing",
                "Bulk generation",
            ],
        },
    ];
}

export function getPlanByVariantId(variantId: string): PlanConfig | undefined {
    return getPlans().find((p) => p.variantId === variantId);
}

export function getPlanBySlug(slug: string): PlanConfig | undefined {
    return getPlans().find((p) => p.slug === slug);
}

// ─── Create Checkout URL ─────────────────────────────────────────────────────
export async function createCheckoutUrl(
    userId: string,
    userEmail: string,
    variantId: string,
    redirectUrl: string
): Promise<string | null> {
    initLemonSqueezy();

    const storeId = parseInt(process.env.LEMONSQUEEZY_STORE_ID!, 10);

    const { data, error } = await createCheckout(storeId, parseInt(variantId, 10), {
        checkoutData: {
            email: userEmail,
            custom: { user_id: userId },
        },
        productOptions: {
            redirectUrl,
        },
    });

    if (error || !data) {
        console.error("Checkout creation error:", error);
        return null;
    }

    return data.data.attributes.url;
}

// ─── Get Subscription Details ────────────────────────────────────────────────
export async function fetchSubscription(subscriptionId: string) {
    initLemonSqueezy();
    const { data, error } = await getSubscription(parseInt(subscriptionId, 10));
    if (error) {
        console.error("Fetch subscription error:", error);
        return null;
    }
    return data;
}

// ─── Cancel Subscription ─────────────────────────────────────────────────────
export async function cancelSubscription(subscriptionId: string) {
    initLemonSqueezy();
    const { data, error } = await lsCancelSubscription(parseInt(subscriptionId, 10));
    if (error) {
        console.error("Cancel subscription error:", error);
        return null;
    }
    return data;
}

// ─── Update Subscription (change plan) ───────────────────────────────────────
export async function updateSubscription(
    subscriptionId: string,
    newVariantId: string
) {
    initLemonSqueezy();
    const { data, error } = await lsUpdateSubscription(parseInt(subscriptionId, 10), {
        variantId: parseInt(newVariantId, 10),
        invoiceImmediately: true, // Forces immediate payment & invoice for the prorated amount
    });
    if (error) {
        console.error("Update subscription error:", error);
        return null;
    }
    return data;
}

// ─── Webhook signature verification ──────────────────────────────────────────
export async function verifyWebhookSignature(
    rawBody: string,
    signature: string
): Promise<boolean> {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
    const computedHex = Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return computedHex === signature;
}
