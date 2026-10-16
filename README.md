# Nova Blaster Website

Public marketing and legal pages for [Nova Blaster](https://github.com/flamurbeqiri1/novablaster) — optimized for App Store Connect **Support URL** and **Privacy Policy URL**, hosted on [Vercel](https://vercel.com).

## Pages

| Path | Purpose |
|------|---------|
| `/` | Homepage with game overview and branding |
| `/privacy` | Privacy policy |
| `/support` | Support contact and FAQ |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel (free `*.vercel.app` URL)

1. Sign in at [vercel.com](https://vercel.com) and **Add New Project** → import **`flamurbeqiri1/novablaster-website`** (Next.js preset, public repo).
2. Deploy with defaults. Vercel sets **`VERCEL_PROJECT_PRODUCTION_URL`** on production builds so canonical URLs, Open Graph, and `sitemap.xml` use your assigned hostname (e.g. `https://novablaster-website.vercel.app`).
3. In App Store Connect, use:
   - **Privacy Policy URL:** `https://YOUR-PROJECT.vercel.app/privacy`
   - **Support URL:** `https://YOUR-PROJECT.vercel.app/support`

You only need **`NEXT_PUBLIC_SITE_URL`** if you add a custom domain later.

## Configuration

Edit [`lib/site.ts`](lib/site.ts) for **`supportEmail`** (when ready) and optional **App Store link**.

## Assets

App icon and launch artwork are exported from the Nova Blaster iOS project (`AppIcon-1024.png`, launch screen image).
