import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

type ChallengePayload = {
  a: number;
  b: number;
  exp: number;
  issued: number;
};

const MIN_SUBMIT_MS = 4_000;
const MAX_AGE_MS = 20 * 60 * 1000;

function getSigningSecret(): string {
  const secret =
    process.env.SUPPORT_FORM_SECRET?.trim() ||
    process.env.SMTP_PASS?.trim() ||
    process.env.SUPPORT_INBOX?.trim();
  if (!secret) {
    throw new Error("Missing SUPPORT_FORM_SECRET or SMTP credentials for captcha signing");
  }
  return secret;
}

function signPayload(payload: ChallengePayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", getSigningSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function parseToken(token: string): ChallengePayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) {
    return null;
  }

  const expected = createHmac("sha256", getSigningSecret()).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as ChallengePayload;
    if (
      typeof payload.a !== "number" ||
      typeof payload.b !== "number" ||
      typeof payload.exp !== "number" ||
      typeof payload.issued !== "number"
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export type MathChallenge = {
  prompt: string;
  token: string;
  issuedAt: number;
};

export function createMathChallenge(): MathChallenge {
  const a = randomInt(2, 13);
  const b = randomInt(2, 13);
  const issued = Date.now();
  const payload: ChallengePayload = { a, b, exp: issued + MAX_AGE_MS, issued };
  return {
    prompt: `What is ${a} + ${b}?`,
    token: signPayload(payload),
    issuedAt: issued,
  };
}

export function verifyMathChallenge(
  token: string,
  answerRaw: string,
  clientIssuedAt?: number,
): boolean {
  const payload = parseToken(token);
  if (!payload) {
    return false;
  }

  const now = Date.now();
  if (now > payload.exp || now - payload.issued > MAX_AGE_MS) {
    return false;
  }

  if (clientIssuedAt !== undefined && clientIssuedAt !== payload.issued) {
    return false;
  }

  const elapsed = now - payload.issued;
  if (elapsed < MIN_SUBMIT_MS) {
    return false;
  }

  const answer = Number.parseInt(answerRaw.trim(), 10);
  if (!Number.isFinite(answer)) {
    return false;
  }

  return answer === payload.a + payload.b;
}
