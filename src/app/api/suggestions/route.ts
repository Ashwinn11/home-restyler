import { NextRequest, NextResponse } from "next/server";
import { generateSuggestions } from "@/lib/gemini";
import { authenticateAndCharge, chargeActionCredits } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const { userId, response: authError } = await authenticateAndCharge(1);
  if (authError) return authError;

  try {
    const { image, mimeType, style, customPrompt } = await req.json();

    if (!image || !style) {
      return NextResponse.json(
        { error: "Missing image or style" },
        { status: 400 }
      );
    }

    const result = await generateSuggestions(
      image,
      mimeType || "image/png",
      customPrompt ? `${style} — ${customPrompt}` : style
    );

    // Fixed credit deduction (Follows Mascot economy)
    await chargeActionCredits(userId, "suggestions", "Design refinement queries");

    return NextResponse.json({ suggestions: result.suggestions });
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Suggestions failed" },
      { status: 500 }
    );
  }
}
