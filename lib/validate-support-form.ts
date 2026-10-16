import { SUPPORT_LIMITS } from "@/lib/support-limits";

export type SupportFieldErrors = {
  name?: string;
  email?: string;
  message?: string;
  captchaAnswer?: string;
};

/** Practical email check for contact forms (server + client). */
export function isValidSupportEmail(value: string): boolean {
  const email = value.trim();
  if (email.length === 0 || email.length > SUPPORT_LIMITS.emailMax) {
    return false;
  }
  // Local part, @, domain with at least one dot in the domain segment.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

export function validateSupportFields(input: {
  name: string;
  email: string;
  message: string;
  captchaAnswer: string;
}): SupportFieldErrors {
  const errors: SupportFieldErrors = {};

  const name = input.name.trim();
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Please enter at least 2 characters for your name.";
  } else if (name.length > SUPPORT_LIMITS.nameMax) {
    errors.name = `Name must be ${SUPPORT_LIMITS.nameMax} characters or fewer.`;
  }

  const email = input.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidSupportEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const message = input.message.trim();
  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < SUPPORT_LIMITS.messageMin) {
    errors.message = `Please add more detail (at least ${SUPPORT_LIMITS.messageMin} characters).`;
  } else if (message.length > SUPPORT_LIMITS.messageMax) {
    errors.message = `Message must be ${SUPPORT_LIMITS.messageMax} characters or fewer.`;
  }

  const captchaAnswer = input.captchaAnswer.trim();
  if (!captchaAnswer) {
    errors.captchaAnswer = "Please answer the human check.";
  } else if (!/^-?\d+$/.test(captchaAnswer)) {
    errors.captchaAnswer = "Enter a whole number for the human check.";
  }

  return errors;
}

export function firstSupportFieldError(errors: SupportFieldErrors): string | null {
  return errors.name ?? errors.email ?? errors.message ?? errors.captchaAnswer ?? null;
}

export function hasSupportFieldErrors(errors: SupportFieldErrors): boolean {
  return Boolean(errors.name || errors.email || errors.message || errors.captchaAnswer);
}
