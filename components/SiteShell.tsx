import Link from "next/link";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
] as const;

export function SiteShell({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath: string;
}) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand-link" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/app-icon.png" alt="" width={40} height={40} />
            <span className="brand-name">{siteConfig.name}</span>
          </Link>
          <nav className="site-nav" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={currentPath === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <p>
          © {siteConfig.copyrightYear} {siteConfig.developer}. {siteConfig.name} — offline arcade
          action for iOS.
        </p>
        <p>
          <Link href="/privacy">Privacy Policy</Link>
          {" · "}
          <Link href="/support">Support</Link>
        </p>
      </footer>
    </div>
  );
}
