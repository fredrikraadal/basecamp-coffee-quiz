import { NextRequest, NextResponse } from "next/server";
import { getMember } from "@/lib/mockDb";

export function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const member = getMember(id);
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  return NextResponse.json(member);
}
