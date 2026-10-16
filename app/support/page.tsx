import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { SupportFormSection } from "@/components/SupportFormSection";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: `Get help with ${siteConfig.name}: troubleshooting, Game Center and iCloud tips, Nova Advisor, and contact.`,
  alternates: { canonical: "/support" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Support · ${siteConfig.name}`,
    description: `Help, FAQs, and contact for ${siteConfig.name} on iOS.`,
    url: "/support",
    type: "website",
  },
};

const faqs = [
  {
    q: "Does Nova Blaster require an internet connection?",
    a: "No. You can launch and play the full arcade loop offline. Game Center leaderboards, achievements, and iCloud sync require connectivity and an Apple ID when you use those features.",
  },
  {
    q: "How do I restore progress on a new device?",
    a: "Install the app while signed in to the same Apple ID. If iCloud is enabled for the app on your previous device, synced progress should merge when the app runs. Local-only progress stays on the device where you earned it.",
  },
  {
    q: "Game Center is not loading. What should I try?",
    a: "Open Settings → Game Center and confirm you are signed in. Force-quit Nova Blaster, check your connection, then tap Game Center from the main menu again. Leaderboards and achievements are optional and do not affect offline play.",
  },
  {
    q: "What is Nova Advisor?",
    a: "Nova Advisor shows short coaching tips between levels. On supported devices, tips may be varied using on-device Apple intelligence. Other devices use the same built-in advisor lines without cloud processing.",
  },
  {
    q: "How do I report a bug or request a feature?",
    a: "Use the contact form on this page. Include your device model, iOS version, app version, ship, and level if you can—screenshots or screen recordings help us reproduce issues.",
  },
];

export default function SupportPage() {
  return (
    <SiteShell currentPath="/support">
      <div className="section prose">
        <h1>Support</h1>
        <p className="updated">
          We&apos;re here to help you get the most out of {siteConfig.name}.
        </p>

        <div id="contact" className="panel support-contact-panel">
          <h2 style={{ marginTop: 0 }}>Contact us</h2>
          <p style={{ margin: "0 0 1.25rem", color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Send a message below. We&apos;ll reply to the email address you enter. A short human
            check on this page helps reduce spam.
          </p>
          <SupportFormSection />
          <p style={{ margin: "1rem 0 0", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Developer: {siteConfig.developer}
          </p>
        </div>

        <h2>Frequently asked questions</h2>
        {faqs.map((item) => (
          <section key={item.q} style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.05rem", color: "var(--text-primary)" }}>
              {item.q}
            </h3>
            <p style={{ margin: 0 }}>{item.a}</p>
          </section>
        ))}

        <h2>Privacy</h2>
        <p>
          See our <Link href="/privacy">Privacy Policy</Link> for how optional Apple services,
          on-device features, and support messages are handled.
        </p>
      </div>
    </SiteShell>
  );
}
