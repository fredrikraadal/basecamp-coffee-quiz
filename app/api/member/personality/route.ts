import { NextRequest, NextResponse } from "next/server";
import { savePersonality } from "@/lib/mockDb";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { memberId, personalityKey } = body as { memberId?: string; personalityKey?: string };

  if (!memberId || !personalityKey) {
    return NextResponse.json({ error: "Missing memberId or personalityKey" }, { status: 400 });
  }

  const updated = savePersonality(memberId, personalityKey);
  if (!updated) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    updatedPoints: updated.points,
    bonusPoints: 25,
  });
}
