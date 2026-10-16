/** Public site configuration — update before App Store submission if needed. */
export const siteConfig = {
  name: "Nova Blaster",
  tagline: "Blast beyond the stars",
  description:
    "Nova Blaster is a fast offline vertical arcade space shooter for iPhone and iPad. Choose your ship, upgrade weapons, survive endless levels and boss battles, and climb Game Center leaderboards.",
  /** Used for canonical URLs, Open Graph, and sitemap. Set SITE_URL on Vercel or use the default. */
  get url(): string {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL;
    if (fromEnv) {
      return fromEnv.startsWith("http") ? fromEnv.replace(/\/$/, "") : `https://${fromEnv.replace(/\/$/, "")}`;
    }
    return "https://novablaster.app";
  },
  developer: "Flamur Beqiri",
  copyrightYear: 2026,
  bundleId: "com.novablaster.NovaBlaster",
  /** Support contact — replace with your preferred public support email. */
  supportEmail: "support@novablaster.app",
  appStoreUrl: "", // optional: App Store link when live
} as const;
