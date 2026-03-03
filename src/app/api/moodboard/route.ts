import { NextRequest, NextResponse } from "next/server";
import { generateMoodBoard } from "@/lib/gemini";
import { authenticateAndCharge, chargeActionCredits } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const { userId, response: authError } = await authenticateAndCharge(1);
  if (authError) return authError;

  try {
    const { image, mimeType } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Missing image" },
        { status: 400 }
      );
    }

    const moodBoard = await generateMoodBoard(image, mimeType || "image/png");

    // Fixed credit deduction (Follows Mascot economy)
    await chargeActionCredits(userId, "moodboard", "Design layout extraction");

    return NextResponse.json(moodBoard);
  } catch (error) {
    console.error("Mood board error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
