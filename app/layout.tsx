import type { Metadata, Viewport } from "next";
import { organizationJsonLd, softwareApplicationJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050a1f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Offline Space Arcade Shooter`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Nova Blaster",
    "space shooter",
    "arcade",
    "offline game",
    "iOS game",
    "bullet hell",
    "Game Center",
  ],
  authors: [{ name: siteConfig.developer }],
  creator: siteConfig.developer,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Blast Beyond the Stars`,
    description: siteConfig.description,
    images: [
      {
        url: "/images/launch-screen.jpg",
        width: 1400,
        height: 1400,
        alt: `${siteConfig.name} launch artwork`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/launch-screen.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [webSiteJsonLd(), organizationJsonLd(), softwareApplicationJsonLd()];

  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
