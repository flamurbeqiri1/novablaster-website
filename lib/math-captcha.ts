import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export type HumanChallengeKind = "add" | "subtract" | "sequence" | "word";

type ChallengePayload = {
  kind: HumanChallengeKind;
  exp: number;
  issued: number;
  a?: number;
  b?: number;
  expected?: string;
};

const MIN_SUBMIT_MS = 4_000;
const MAX_AGE_MS = 20 * 60 * 1000;

const WORDS = [
  "apple",
  "river",
  "cloud",
  "orange",
  "planet",
  "silver",
  "forest",
  "monday",
  "bridge",
  "garden",
  "purple",
  "window",
] as const;

const CHALLENGE_KINDS: HumanChallengeKind[] = ["add", "subtract", "sequence", "word"];

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
    const raw = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as ChallengePayload & {
      kind?: HumanChallengeKind;
    };
    if (typeof raw.exp !== "number" || typeof raw.issued !== "number") {
      return null;
    }
    if (raw.kind && CHALLENGE_KINDS.includes(raw.kind)) {
      return raw;
    }
    // Tokens issued before multi-kind captcha only stored add operands.
    if (
      typeof raw.a === "number" &&
      typeof raw.b === "number" &&
      raw.expected === undefined
    ) {
      return { kind: "add", a: raw.a, b: raw.b, exp: raw.exp, issued: raw.issued };
    }
    return null;
  } catch {
    return null;
  }
}

export type HumanChallengeAnswerFormat = "number" | "text";

export type HumanChallenge = {
  kind: HumanChallengeKind;
  prompt: string;
  token: string;
  issuedAt: number;
  answerFormat: HumanChallengeAnswerFormat;
};

/** @deprecated Use HumanChallenge */
export type MathChallenge = HumanChallenge;

function answerFormatForKind(kind: HumanChallengeKind): HumanChallengeAnswerFormat {
  return kind === "word" ? "text" : "number";
}

function buildAddChallenge(issued: number): { payload: ChallengePayload; prompt: string } {
  const a = randomInt(2, 13);
  const b = randomInt(2, 13);
  return {
    payload: { kind: "add", a, b, exp: issued + MAX_AGE_MS, issued },
    prompt: `What is ${a} + ${b}?`,
  };
}

function buildSubtractChallenge(issued: number): { payload: ChallengePayload; prompt: string } {
  const a = randomInt(12, 28);
  const b = randomInt(2, a - 1);
  return {
    payload: { kind: "subtract", a, b, exp: issued + MAX_AGE_MS, issued },
    prompt: `What is ${a} − ${b}?`,
  };
}

function buildSequenceChallenge(issued: number): { payload: ChallengePayload; prompt: string } {
  const start = randomInt(2, 9);
  const step = randomInt(2, 6);
  const terms = [start, start + step, start + 2 * step];
  const answer = start + 3 * step;
  return {
    payload: { kind: "sequence", a: answer, exp: issued + MAX_AGE_MS, issued },
    prompt: `What number comes next? ${terms.join(", ")}, ?`,
  };
}

function buildWordChallenge(issued: number): { payload: ChallengePayload; prompt: string } {
  const word = WORDS[randomInt(0, WORDS.length)];
  return {
    payload: { kind: "word", expected: word, exp: issued + MAX_AGE_MS, issued },
    prompt: `Type this word: ${word}`,
  };
}

function buildChallenge(kind: HumanChallengeKind, issued: number): HumanChallenge {
  const builders = {
    add: buildAddChallenge,
    subtract: buildSubtractChallenge,
    sequence: buildSequenceChallenge,
    word: buildWordChallenge,
  } as const;

  const { payload, prompt } = builders[kind](issued);
  return {
    kind,
    prompt,
    token: signPayload(payload),
    issuedAt: issued,
    answerFormat: answerFormatForKind(kind),
  };
}

export function createHumanChallenge(): HumanChallenge {
  const kind = CHALLENGE_KINDS[randomInt(0, CHALLENGE_KINDS.length)];
  return buildChallenge(kind, Date.now());
}

/** @deprecated Use createHumanChallenge */
export function createMathChallenge(): HumanChallenge {
  return createHumanChallenge();
}

function normalizeWordAnswer(value: string): string {
  return value.trim().toLowerCase();
}

function verifyPayloadAnswer(payload: ChallengePayload, answerRaw: string): boolean {
  const trimmed = answerRaw.trim();
  switch (payload.kind) {
    case "add": {
      if (payload.a === undefined || payload.b === undefined) {
        return false;
      }
      const answer = Number.parseInt(trimmed, 10);
      return Number.isFinite(answer) && answer === payload.a + payload.b;
    }
    case "subtract": {
      if (payload.a === undefined || payload.b === undefined) {
        return false;
      }
      const answer = Number.parseInt(trimmed, 10);
      return Number.isFinite(answer) && answer === payload.a - payload.b;
    }
    case "sequence": {
      if (payload.a === undefined) {
        return false;
      }
      const answer = Number.parseInt(trimmed, 10);
      return Number.isFinite(answer) && answer === payload.a;
    }
    case "word": {
      if (!payload.expected) {
        return false;
      }
      return normalizeWordAnswer(trimmed) === normalizeWordAnswer(payload.expected);
    }
    default:
      return false;
  }
}

export function verifyHumanChallenge(
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

  return verifyPayloadAnswer(payload, answerRaw);
}

/** @deprecated Use verifyHumanChallenge */
export function verifyMathChallenge(
  token: string,
  answerRaw: string,
  clientIssuedAt?: number,
): boolean {
  return verifyHumanChallenge(token, answerRaw, clientIssuedAt);
}
