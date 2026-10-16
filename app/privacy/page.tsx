import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}, the offline iOS space arcade shooter by ${siteConfig.developer}.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Privacy Policy · ${siteConfig.name}`,
    description: `How ${siteConfig.name} handles on-device data, optional Apple services, and this website.`,
    url: "/privacy",
    type: "article",
  },
};

const effectiveDate = "October 16, 2026";

export default function PrivacyPage() {
  return (
    <SiteShell currentPath="/privacy">
      <article className="section prose">
        <h1>Privacy Policy</h1>
        <p className="updated">
          Effective date: {effectiveDate} · App: {siteConfig.name}
        </p>

        <p>
          {siteConfig.developer} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) built{" "}
          {siteConfig.name} as a commercial iOS game. This policy explains what information is
          processed when you use the app and this website, and how that processing works.
        </p>

        <h2>Summary</h2>
        <ul>
          <li>We do not operate user accounts for {siteConfig.name}.</li>
          <li>We do not sell your personal information.</li>
          <li>
            We do not embed third-party advertising or analytics SDKs in the app based on the
            current {siteConfig.name} 1.0 codebase.
          </li>
          <li>
            Gameplay progress and settings are stored on your device. Optional Apple services
            (iCloud and Game Center) may sync or display data according to your Apple ID settings.
          </li>
          <li>
            On supported devices, Apple&apos;s on-device models may generate Nova Advisor tips and
            boss dialogue locally. That processing stays on your device and is not sent to our
            servers.
          </li>
        </ul>

        <h2>Information we do not collect directly</h2>
        <p>
          We do not require you to create an account with us, and we do not operate backend servers
          that receive your gameplay telemetry, contact details, or precise location for{" "}
          {siteConfig.name}. We do not knowingly collect personal information from children through
          our own forms or registration flows.
        </p>

        <h2>Data stored on your device</h2>
        <p>The app stores game-related data locally on your iPhone, such as:</p>
        <ul>
          <li>Progress, scores, unlocks, and lifetime statistics</li>
          <li>Settings such as audio preferences and selected ship</li>
          <li>Temporary gameplay state while you play</li>
        </ul>
        <p>
          You can remove this data by deleting the app from your device. Removing the app does not
          automatically remove data that Apple may retain for optional services described below.
        </p>

        <h2>Apple iCloud (optional)</h2>
        <p>
          If you are signed in to iCloud and have iCloud enabled for the app, progress and related
          values may sync through Apple&apos;s iCloud key-value storage so you can continue on another
          device signed in with the same Apple ID. Apple processes and secures this data under{" "}
          <a href="https://www.apple.com/legal/privacy/" rel="noopener noreferrer">
            Apple&apos;s Privacy Policy
          </a>
          . We do not receive direct access to your iCloud containers on our own infrastructure.
        </p>

        <h2>Apple Game Center (optional)</h2>
        <p>
          If you choose to use Game Center, Apple may process identifiers and gameplay scores or
          achievements associated with your Game Center profile to provide leaderboards and
          achievements. Game Center requires an internet connection when used. Apple&apos;s terms and
          privacy policy govern that processing.
        </p>

        <h2>On-device AI (Nova Advisor)</h2>
        <p>
          On compatible devices running supported system software, {siteConfig.name} may use
          Apple&apos;s on-device Foundation Models to vary Nova Advisor coaching tips and some boss
          dialogue. When available, this generation happens on your device. Devices without
          generative model support use built-in fallback text instead. We do not operate a cloud
          AI service for this feature and do not receive the content of those on-device prompts or
          responses on our servers.
        </p>

        <h2>Website and support messages</h2>
        <p>
          This public website ({siteConfig.url}) is hosted on Vercel. Like most web hosts, Vercel
          may process standard server logs (such as IP address, user agent, and requested URLs) for
          security and operation. See{" "}
          <a href="https://vercel.com/legal/privacy-policy" rel="noopener noreferrer">
            Vercel&apos;s Privacy Policy
          </a>
          . We do not use cookie-based advertising trackers on this site.
        </p>
        <p>
          If you use the <Link href="/support#contact">Support contact form</Link>, we collect the
          name, email address, and message you submit so we can respond. Submissions include a simple
          verification step on our server to reduce automated abuse. We use your email only to reply
          about your request; we do not sell support messages or use them for advertising lists.
        </p>

        <h2>App Store</h2>
        <p>
          If you download {siteConfig.name} from the Apple App Store, Apple processes payment,
          download, and device information according to its policies. We receive limited
          information from Apple related to app distribution and developer program requirements, not
          your in-game activity on our servers.
        </p>

        <h2>Legal bases and your rights</h2>
        <p>
          Because we do not operate account systems or direct marketing lists for the app, most
          processing is either performed locally on your device or by Apple when you opt into Apple
          services. Depending on where you live, you may have rights to access, correct, or delete
          personal information held by companies that process data about you. For data stored only
          on your device, deleting the app is the primary way to remove it. For Apple services,
          use Apple&apos;s settings and support channels.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy when the app or legal requirements change. We will post the
          revised policy on this page and update the effective date above.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy or {siteConfig.name}: use the contact form on our{" "}
          <Link href="/support#contact">Support</Link> page.
        </p>
      </article>
    </SiteShell>
  );
}
