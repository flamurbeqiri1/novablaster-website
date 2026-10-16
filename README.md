# Nova Blaster Website

Public marketing and legal pages for Nova Blaster — App Store **Support URL** and **Privacy Policy URL**, hosted on [Vercel](https://vercel.com).

## Pages

| Path | Purpose |
|------|---------|
| `/` | Homepage with game overview and branding |
| `/privacy` | Privacy policy |
| `/support` | FAQ and protected contact form |

Support mail is delivered to a private inbox via server-side SMTP. The inbox address is **never** shown on the site.

## Local development

Copy `.env.example` to `.env.local` and fill in values, then:

```bash
npm install
npm run dev
```

## Vercel environment variables

Set these in the Vercel project (**Settings → Environment Variables**), for **Production** (and Preview if you test there):

| Variable | Purpose |
|----------|---------|
| `SUPPORT_INBOX` | Private destination inbox (your Gmail) |
| `SMTP_USER` | Gmail address used to send mail |
| `SMTP_PASS` | [Gmail App Password](https://support.google.com/accounts/answer/185833) (not your normal password) |
| `SMTP_HOST` | Optional, default `smtp.gmail.com` |
| `SMTP_PORT` | Optional, default `465` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |

Create Turnstile keys at [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile). Add hostnames `novablaster-website.vercel.app` and `localhost`.

Redeploy after changing env vars.

## App Store Connect

- **Privacy Policy URL:** `https://novablaster-website.vercel.app/privacy`
- **Support URL:** `https://novablaster-website.vercel.app/support`

Optional: **`NEXT_PUBLIC_SITE_URL`** if you add a custom domain later.

## Configuration

Edit [`lib/site.ts`](lib/site.ts) for optional **App Store link** when the listing is live.
