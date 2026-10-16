import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const features = [
  {
    title: "Play offline",
    body: "Core gameplay runs without an internet connection. Optional Game Center and iCloud features use Apple services when you choose to use them.",
  },
  {
    title: "Three ships, deep weapons",
    body: "Pilot distinct ships and power up Bullet, Triple Spread, and Fireball across strength tiers as levels escalate.",
  },
  {
    title: "Endless challenge",
    body: "Procedural levels, tactical formations, hazards, and boss battles built for quick runs and high-score chases.",
  },
  {
    title: "Nova Advisor",
    body: "On compatible devices, on-device AI can vary coaching tips and boss dialogue. Everywhere else, reliable built-in lines keep play moving.",
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
          alt=""
          width={1400}
          height={1400}
          fetchPriority="high"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <div>
            <p className="hero-eyebrow">Offline arcade action</p>
            <h1 id="hero-heading">{siteConfig.tagline}</h1>
            <p className="hero-lead">{siteConfig.description}</p>
            <div className="hero-actions">
              {siteConfig.appStoreUrl ? (
                <a className="btn btn-primary" href={siteConfig.appStoreUrl}>
                  Download on the App Store
                </a>
              ) : (
                <span className="btn btn-primary" style={{ opacity: 0.85 }}>
                  Coming to the App Store
                </span>
              )}
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

      <section className="section section-narrow">
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>App Store links</h2>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            Use this site for App Store Connect{" "}
            <Link href="/privacy">Privacy Policy</Link> and <Link href="/support">Support</Link>{" "}
            URLs. On Vercel&apos;s free <code style={{ color: "var(--accent-green)" }}>*.vercel.app</code>{" "}
            domain, production SEO URLs are picked up automatically—no custom domain required.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
