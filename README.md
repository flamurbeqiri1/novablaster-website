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

## Deploy on Vercel

1. Import this GitHub repository in Vercel (framework preset: **Next.js**).
2. Add environment variable **`NEXT_PUBLIC_SITE_URL`** = your production URL (e.g. `https://novablaster.app`) so canonical URLs, Open Graph, and `sitemap.xml` are correct.
3. Deploy. Use:
   - **Privacy Policy URL:** `https://your-domain/privacy`
   - **Support URL:** `https://your-domain/support`

## Configuration

Edit [`lib/site.ts`](lib/site.ts) for support email, App Store link, and default domain.

## Assets

App icon and launch artwork are exported from the Nova Blaster iOS project (`AppIcon-1024.png`, launch screen image).
