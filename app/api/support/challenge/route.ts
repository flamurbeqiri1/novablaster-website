import { NextResponse } from "next/server";
import { createHumanChallenge } from "@/lib/math-captcha";

export async function GET() {
  try {
    const challenge = createHumanChallenge();
    return NextResponse.json(challenge);
  } catch {
    return NextResponse.json({ error: "Support form is not configured." }, { status: 503 });
  }
}
