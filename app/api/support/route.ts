import { NextResponse, type NextRequest } from "next/server";
import { verifyMathChallenge } from "@/lib/math-captcha";
import { sendSupportEmail } from "@/lib/send-support-email";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 8000;

type SupportBody = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  captchaToken?: string;
  captchaAnswer?: string;
  captchaIssuedAt?: number;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  let body: SupportBody;
  try {
    body = (await request.json()) as SupportBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const captchaToken = body.captchaToken?.trim() ?? "";
  const captchaAnswer = body.captchaAnswer?.trim() ?? "";

  if (!name || name.length > MAX_NAME) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!email || email.length > MAX_EMAIL || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
  }
  if (!captchaToken || !captchaAnswer) {
    return NextResponse.json({ error: "Please answer the human check." }, { status: 400 });
  }

  let human = false;
  try {
    human = verifyMathChallenge(captchaToken, captchaAnswer, body.captchaIssuedAt);
  } catch {
    human = false;
  }

  if (!human) {
    return NextResponse.json({ error: "Human check failed. Check your answer and try again." }, { status: 403 });
  }

  try {
    await sendSupportEmail({ name, email, message });
  } catch (error) {
    console.error("Support email failed:", error);
    return NextResponse.json(
      { error: "Could not send your message right now. Please try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
