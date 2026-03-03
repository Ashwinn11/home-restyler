import { NextRequest, NextResponse } from "next/server";
import { generateRefinedImage } from "@/lib/gemini";
import { authenticateAndCharge, chargeActionCredits } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const { userId, response: authError } = await authenticateAndCharge(1);
  if (authError) return authError;

  try {
    const { history, message, currentImage, currentImageMimeType, elementFilter } =
      await req.json();

    if (!currentImage || !message) {
      return NextResponse.json(
        { error: "Missing image or message" },
        { status: 400 }
      );
    }

    const result = await generateRefinedImage(
      history || [],
      message,
      currentImage,
      currentImageMimeType || "image/png",
      elementFilter || null
    );

    // Fixed credit deduction (Follows Mascot economy)
    await chargeActionCredits(userId, "refine", message.slice(0, 50));

    return NextResponse.json({
      image: result.image,
      text: result.text,
      creditsUsed: result.tokenCount,
    });
  } catch (error) {
    console.error("Refine error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refinement failed" },
      { status: 500 }
    );
  }
}
