import { NextRequest, NextResponse } from "next/server";
import { suggestSkills } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const skills = await suggestSkills(body);
    return NextResponse.json({ skills });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Skill suggestion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
