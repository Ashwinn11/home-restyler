import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { deductCredits, hasEnoughCredits, getActionCost } from "@/lib/credits";

// ─── Token-to-credits conversion ─────────────────────────────────────────────
// 1 credit = 1,000 tokens (rounded up, minimum 1 credit per call)
const TOKENS_PER_CREDIT = 1000;

export function tokensToCredits(tokenCount: number): number {
    if (tokenCount <= 0) return 1; // minimum 1 credit
    return Math.max(1, Math.ceil(tokenCount / TOKENS_PER_CREDIT));
}

/**
 * Authenticate user and optionally pre-check a minimum credit balance.
 * Returns { userId, response? } — if response is set, return it immediately (error).
 */
export async function authenticateAndCharge(
    minCredits: number = 1
): Promise<{
    userId: string;
    response?: NextResponse;
}> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            userId: "",
            response: NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            ),
        };
    }

    if (minCredits > 0) {
        const enough = await hasEnoughCredits(user.id, minCredits);
        if (!enough) {
            return {
                userId: user.id,
                response: NextResponse.json(
                    { error: "Insufficient credits. Please upgrade your plan." },
                    { status: 402 }
                ),
            };
        }
    }

    return { userId: user.id };
}

/**
 * Deduct credits based on a fixed action name (Following Mascot's economy).
 */
export async function chargeActionCredits(
    userId: string,
    action: string,
    description: string
) {
    const credits = getActionCost(action);
    return deductCredits(userId, credits, `${action.charAt(0).toUpperCase() + action.slice(1)}: ${description} (${credits} credits)`);
}
