import { NextRequest, NextResponse } from "next/server";
import { enhanceExperience, enhanceProjectDescription } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.type === "project") {
      const bullets = await enhanceProjectDescription(body);
      return NextResponse.json({ bullets });
    }
    const bullets = await enhanceExperience(body);
    return NextResponse.json({ bullets });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Enhancement failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
