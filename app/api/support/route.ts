import { NextResponse, type NextRequest } from "next/server";
import { sendSupportEmail } from "@/lib/send-support-email";
import { verifyTurnstileToken } from "@/lib/turnstile";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 8000;

type SupportBody = {
  name?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
  company?: string;
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
  const turnstileToken = body.turnstileToken?.trim() ?? "";

  if (!name || name.length > MAX_NAME) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!email || email.length > MAX_EMAIL || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
  }
  if (!turnstileToken) {
    return NextResponse.json({ error: "Please complete the human check." }, { status: 400 });
  }

  const remoteIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined;

  const human = await verifyTurnstileToken(turnstileToken, remoteIp);
  if (!human) {
    return NextResponse.json({ error: "Human check failed. Try again." }, { status: 403 });
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
