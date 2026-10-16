/** Public site configuration — update before App Store submission if needed. */
export const siteConfig = {
  name: "Nova Blaster",
  tagline: "Blast beyond the stars",
  aiHighlight: "On-device AI advisor",
  description:
    "Nova Blaster is a fast offline vertical arcade space shooter for iPhone. Pick a ship, power up weapons, survive endless levels and boss battles, and get on-device AI coaching from Nova Advisor between levels.",
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
  appStoreUrl: "",
} as const;
