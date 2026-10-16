/** Public site configuration — update before App Store submission if needed. */
export const siteConfig = {
  name: "Nova Blaster",
  tagline: "Blast beyond the stars",
  description:
    "Nova Blaster is a fast offline vertical arcade space shooter for iPhone and iPad. Choose your ship, upgrade weapons, survive endless levels and boss battles, and climb Game Center leaderboards.",
  /**
   * Canonical site URL. On Vercel production, `VERCEL_PROJECT_PRODUCTION_URL` is set automatically
   * (your free *.vercel.app domain). Override with NEXT_PUBLIC_SITE_URL only if you add a custom domain later.
   */
  get url(): string {
    const candidates = [
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
      process.env.VERCEL_URL,
    ].filter((value): value is string => Boolean(value));

    for (const raw of candidates) {
      return raw.startsWith("http") ? raw.replace(/\/$/, "") : `https://${raw.replace(/\/$/, "")}`;
    }

    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }

    // Default production hostname when importing this repo as `novablaster-website` on Vercel.
    return "https://novablaster-website.vercel.app";
  },
  developer: "Flamur Beqiri",
  copyrightYear: 2026,
  bundleId: "com.novablaster.NovaBlaster",
  /** Set when ready for App Store support URL. Leave empty until you have a public inbox. */
  supportEmail: "",
  appStoreUrl: "",
} as const;

export function supportEmailOrNull(): string | null {
  const trimmed = siteConfig.supportEmail.trim();
  return trimmed.length > 0 ? trimmed : null;
}
