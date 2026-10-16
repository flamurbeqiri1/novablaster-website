import { SUPPORT_LIMITS } from "@/lib/support-limits";

/** In-memory per-instance rate limit (best-effort on serverless; no external service). */
const ipHits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_PER_IP = 8;

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "trashmail.com",
  "getnada.com",
  "maildrop.cc",
  "fakeinbox.com",
  "dispostable.com",
  "mintemail.com",
]);

export type SpamCheckResult = { ok: true } | { ok: false; reason: string };

function emailDomain(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 0) {
    return "";
  }
  return email.slice(at + 1).toLowerCase();
}

export function checkRateLimit(clientIp: string | undefined): SpamCheckResult {
  if (!clientIp) {
    return { ok: true };
  }

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (ipHits.get(clientIp) ?? []).filter((t) => t > windowStart);

  if (hits.length >= RATE_LIMIT_MAX_PER_IP) {
    return { ok: false, reason: "Too many messages from your connection. Try again later." };
  }

  hits.push(now);
  ipHits.set(clientIp, hits);

  if (ipHits.size > 5000) {
    for (const [key, times] of ipHits) {
      const recent = times.filter((t) => t > windowStart);
      if (recent.length === 0) {
        ipHits.delete(key);
      } else {
        ipHits.set(key, recent);
      }
    }
  }

  return { ok: true };
}

export function checkDisposableEmail(email: string): SpamCheckResult {
  const domain = emailDomain(email);
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { ok: false, reason: "Please use a regular email address we can reply to." };
  }
  return { ok: true };
}

function countLinks(text: string): number {
  const urlMatches = text.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi);
  return urlMatches?.length ?? 0;
}

function hasLongRepeatedRun(text: string): boolean {
  return /(.)\1{39,}/u.test(text);
}

export function checkMessageContent(message: string): SpamCheckResult {
  const trimmed = message.trim();

  if (trimmed.length < SUPPORT_LIMITS.messageMin) {
    return {
      ok: false,
      reason: `Please add a bit more detail (at least ${SUPPORT_LIMITS.messageMin} characters).`,
    };
  }

  if (trimmed.length > SUPPORT_LIMITS.messageMax) {
    return {
      ok: false,
      reason: `Message is too long (max ${SUPPORT_LIMITS.messageMax} characters).`,
    };
  }

  if (countLinks(trimmed) > SUPPORT_LIMITS.maxLinksInMessage) {
    return {
      ok: false,
      reason: `Please use at most ${SUPPORT_LIMITS.maxLinksInMessage} links in your message.`,
    };
  }

  if (hasLongRepeatedRun(trimmed)) {
    return { ok: false, reason: "Message looks invalid. Please describe your issue normally." };
  }

  return { ok: true };
}

export function checkSupportSubmission(input: {
  email: string;
  message: string;
  clientIp?: string;
}): SpamCheckResult {
  const rate = checkRateLimit(input.clientIp);
  if (!rate.ok) {
    return rate;
  }

  const disposable = checkDisposableEmail(input.email);
  if (!disposable.ok) {
    return disposable;
  }

  return checkMessageContent(input.message);
}
