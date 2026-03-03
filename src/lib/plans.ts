// ─── Plan definitions (no env vars — safe for client components) ─────────────
export interface PlanDisplay {
    name: string;
    slug: "starter" | "pro" | "studio";
    credits: number;
    priceCents: number;
    priceLabel: string;
    features: string[];
}

export const PLANS: PlanDisplay[] = [
    {
        name: "Starter",
        slug: "starter",
        credits: 100,
        priceCents: 499,
        priceLabel: "$4.99/mo",
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
