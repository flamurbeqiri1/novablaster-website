/** Shared limits for the public support form (typical contact-form sizes). */
export const SUPPORT_LIMITS = {
  nameMax: 120,
  emailMax: 254,
  /** 2,000 chars is a common cap for public contact/support forms (enough for bug reports, not essay spam). */
  messageMax: 2000,
  /** Require a little real detail beyond empty template lines. */
  messageMin: 40,
  maxLinksInMessage: 4,
} as const;
