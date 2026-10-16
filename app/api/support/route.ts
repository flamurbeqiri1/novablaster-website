import { NextResponse, type NextRequest } from "next/server";
import { verifyMathChallenge } from "@/lib/math-captcha";
import { sendSupportEmail } from "@/lib/send-support-email";
import { checkSupportSubmission } from "@/lib/spam-guards";
import { firstSupportFieldError, validateSupportFields } from "@/lib/validate-support-form";

type SupportBody = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  captchaToken?: string;
  captchaAnswer?: string;
  captchaIssuedAt?: number;
};

function clientIp(request: NextRequest): string | undefined {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined
  );
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

  const name = body.name ?? "";
  const email = body.email ?? "";
  const message = body.message ?? "";
  const captchaAnswer = body.captchaAnswer ?? "";
  const captchaToken = body.captchaToken?.trim() ?? "";

  const fieldErrors = validateSupportFields({ name, email, message, captchaAnswer });
  const fieldError = firstSupportFieldError(fieldErrors);
  if (fieldError) {
    return NextResponse.json({ error: fieldError }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  const spam = checkSupportSubmission({
    email: trimmedEmail,
    message: trimmedMessage,
    clientIp: clientIp(request),
  });
  if (!spam.ok) {
    return NextResponse.json({ error: spam.reason }, { status: 400 });
  }

  if (!captchaToken) {
    return NextResponse.json({ error: "Human check expired. Refresh the question and try again." }, { status: 400 });
  }

  let human = false;
  try {
    human = verifyMathChallenge(captchaToken, captchaAnswer.trim(), body.captchaIssuedAt);
  } catch {
    human = false;
  }

  if (!human) {
    return NextResponse.json({ error: "Human check failed. Check your answer and try again." }, { status: 403 });
  }

  try {
    await sendSupportEmail({ name: trimmedName, email: trimmedEmail, message: trimmedMessage });
  } catch (error) {
    console.error("Support email failed:", error);
    return NextResponse.json(
      { error: "Could not send your message right now. Please try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
