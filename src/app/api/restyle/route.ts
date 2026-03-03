import { NextRequest, NextResponse } from "next/server";
import {
  generateRestyledImage,
  generatePaintedImage,
} from "@/lib/gemini";
import type { AppMode } from "@/lib/types";
import { authenticateAndCharge, chargeActionCredits } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const { userId, response: authError } = await authenticateAndCharge(1);
  if (authError) return authError;

  try {
    const { image, mimeType, style, customPrompt, mode, colorHex, finish } =
      await req.json();

    const appMode: AppMode = mode || "restyle";

    if (!image) {
      return NextResponse.json(
        { error: "Missing image" },
        { status: 400 }
      );
    }

    const mime = mimeType || "image/jpeg";
    let result: { image: string; text?: string; modelParts: unknown[]; tokenCount: number };

    switch (appMode) {
      case "paint":
        if (!colorHex) {
          return NextResponse.json(
            { error: "Missing color" },
            { status: 400 }
          );
        }
        result = await generatePaintedImage(
          image,
          mime,
          colorHex,
          finish || "Matte"
        );
        break;

      default:
        if (!style) {
          return NextResponse.json(
            { error: "Missing style" },
            { status: 400 }
          );
        }
        result = await generateRestyledImage(image, mime, style, customPrompt);
        break;
    }

    // Fixed credit deduction (Follows Mascot economy)
    const action = appMode === "paint" ? "paint" : "restyle";
    await chargeActionCredits(userId, action, `${style || colorHex}`);

    return NextResponse.json({
      image: result.image,
      text: result.text,
      modelParts: result.modelParts,
      creditsUsed: result.tokenCount,
    });
  } catch (error) {
    console.error("Restyle error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
