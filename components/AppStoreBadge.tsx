import { siteConfig } from "@/lib/site";

const APPLE_BADGE_SRC =
  "https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83";

/** Apple-style badge when the listing is not live yet (not an official Apple marketing asset). */
function ComingSoonAppStoreBadge() {
  return (
    <div className="app-store-badge-soon" role="img" aria-label="Coming to the App Store">
      <svg viewBox="0 0 156 52" width={156} height={52} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="156" height="52" rx="8" fill="#000" />
        <path
          fill="#fff"
          d="M23.6 26.2c-.03-2.9 2.37-4.28 2.47-4.35-1.35-1.97-3.45-2.24-4.19-2.27-1.78-.18-3.47 1.05-4.37 1.05-.91 0-2.31-1.02-3.8-1-1.95.03-3.75 1.13-4.75 2.88-2.03 3.52-.52 8.73 1.46 11.59 1 1.43 2.17 3.04 3.72 2.98 1.5-.06 2.06-.97 3.87-.97 1.8 0 2.31.97 3.88.94 1.6-.03 2.62-1.45 3.6-2.89 1.13-1.65 1.6-3.25 1.62-3.33-.04-.02-3.12-1.2-3.15-4.73zm-2.98-8.68c.82-.99 1.37-2.37 1.22-3.74-1.18.05-2.61.79-3.46 1.78-.76.88-1.42 2.29-1.24 3.64 1.31.1 2.65-.67 3.48-1.68z"
        />
        <text
          x="44"
          y="19"
          fill="#fff"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
          fontSize="9"
          fontWeight="500"
        >
          Coming to the
        </text>
        <text
          x="44"
          y="36"
          fill="#fff"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
          fontSize="17"
          fontWeight="600"
          letterSpacing="-0.02em"
        >
          App Store
        </text>
      </svg>
    </div>
  );
}

export function AppStoreBadge() {
  if (siteConfig.appStoreUrl) {
    return (
      <a
        className="app-store-badge-link"
        href={siteConfig.appStoreUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={APPLE_BADGE_SRC}
          alt="Download on the App Store"
          width={156}
          height={52}
          loading="lazy"
        />
      </a>
    );
  }

  return <ComingSoonAppStoreBadge />;
}
