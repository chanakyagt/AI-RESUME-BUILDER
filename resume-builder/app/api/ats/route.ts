import { NextRequest, NextResponse } from "next/server";
import { getATSScore } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();
    const result = await getATSScore(resumeText);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "ATS analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
