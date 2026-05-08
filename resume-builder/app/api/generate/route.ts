import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const summary = await generateSummary(body);
    return NextResponse.json({ summary });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
