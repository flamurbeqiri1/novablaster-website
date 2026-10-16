import type { Metadata } from "next";
import Link from "next/link";
import { AppStoreBadge } from "@/components/AppStoreBadge";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offline Space Arcade Shooter for iPhone",
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — Blast Beyond the Stars`,
    description: siteConfig.description,
    url: "/",
    type: "website",
    images: [
      {
        url: "/images/launch-screen.jpg",
        width: 1400,
        height: 1400,
        alt: `${siteConfig.name} — vertical space arcade shooter for iPhone`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Offline Space Arcade Shooter`,
    description: siteConfig.description,
    images: ["/images/launch-screen.jpg"],
  },
};

const features = [
  {
    title: "Offline arcade action",
    body: "Play endless space battles with no internet required. Optional Game Center and iCloud use Apple services only when you turn them on.",
  },
  {
    title: "Different ships",
    body: "Choose a ship that fits your style—each changes speed, fire rate, hull, and starting lives as you push for a better run.",
  },
  {
    title: "Upgradeable weapons",
    body: "Power up Bullet, Triple Spread, and Fireball across deep strength tiers and adapt as enemy pressure ramps up.",
  },
  {
    title: "Endless procedural levels",
    body: "Survive scaling difficulty, survival objectives, and an endless sequence of levels built for quick sessions and long high-score chases.",
  },
  {
    title: "Tactical bosses & hazards",
    body: "Break through formations, dodge world objects and hazards, and face a rotating roster of bosses with distinct attack patterns.",
  },
  {
    title: "One-touch controls",
    body: "Hold to move and fire—fast, modern vertical arcade action built for iPhone.",
  },
  {
    title: "On-device AI advisor",
    body: "Nova Advisor delivers short coaching tips between levels. On compatible devices, on-device AI can vary tips and boss dialogue; built-in lines everywhere else.",
  },
  {
    title: "Leaderboards & progress",
    body: "Climb Game Center leaderboards, unlock achievements, improve your pilot rank, and sync lifetime stats with iCloud on the same Apple ID.",
  },
];

export default function HomePage() {
  return (
    <SiteShell currentPath="/">
      <section className="hero" aria-labelledby="hero-heading">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-bg"
          src="/images/launch-screen.jpg"
          alt={`${siteConfig.name} — cosmic arcade shooter artwork with hero ship and Nova emblem`}
          width={1400}
          height={1400}
          fetchPriority="high"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <div>
            <p className="hero-eyebrow">Offline arcade action</p>
            <p className="hero-ai-badge">{siteConfig.aiHighlight}</p>
            <h1 id="hero-heading">{siteConfig.tagline}</h1>
            <p className="hero-lead">{siteConfig.description}</p>
            <div className="hero-actions">
              <AppStoreBadge />
              <Link className="btn btn-secondary" href="/support">
                Get support
              </Link>
            </div>
          </div>
          <div className="panel" style={{ justifySelf: "center", maxWidth: 320 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/app-icon.png"
              alt={`${siteConfig.name} app icon`}
              width={512}
              height={512}
              style={{ display: "block", borderRadius: 22 }}
            />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="features-heading">
        <h2 id="features-heading">Features</h2>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="panel">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
