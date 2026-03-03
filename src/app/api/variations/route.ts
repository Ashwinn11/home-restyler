import { NextRequest, NextResponse } from "next/server";
import { generateRestyledImage } from "@/lib/gemini";
import { authenticateAndCharge, chargeActionCredits } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  // Pre-check minimum cost (20 credits) before generating variations
  const { userId, response: authError } = await authenticateAndCharge(20);
  if (authError) return authError;

  try {
    const { image, mimeType, style, customPrompt } = await req.json();

    if (!image || !style) {
      return NextResponse.json(
        { error: "Missing image or style" },
        { status: 400 }
      );
    }

    const mime = mimeType || "image/jpeg";

    const results = await Promise.allSettled([
      generateRestyledImage(image, mime, style, customPrompt),
      generateRestyledImage(image, mime, style, customPrompt),
      generateRestyledImage(image, mime, style, customPrompt),
      generateRestyledImage(image, mime, style, customPrompt),
    ]);

    let totalTokens = 0;
    const variations = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => {
        const val = (
          r as PromiseFulfilledResult<{ image: string; text?: string; tokenCount: number }>
        ).value;
        totalTokens += val.tokenCount;
        return { image: val.image, text: val.text };
      });

    if (variations.length === 0) {
      return NextResponse.json(
        { error: "All variations failed to generate" },
        { status: 500 }
      );
    }

    // Fixed credit deduction (Follows Mascot economy)
    await chargeActionCredits(userId, "variations", `${style} (${variations.length}x)`);

    return NextResponse.json({ variations, creditsUsed: totalTokens });
  } catch (error) {
    console.error("Variations error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
