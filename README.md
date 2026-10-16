# Nova Blaster Website

Public marketing and legal pages for Nova Blaster — App Store **Support URL** and **Privacy Policy URL**, hosted on [Vercel](https://vercel.com).

## Pages

| Path | Purpose |
|------|---------|
| `/` | Homepage with game overview and branding |
| `/privacy` | Privacy policy |
| `/support` | FAQ and protected contact form |

Support mail goes to a **private inbox** (env var only). The address is never shown on the site.

## Support form email (recommended: Resend)

Gmail often **does not show “App passwords”** in Security even when 2-Step Verification is on (Workspace policies, passkey-first accounts, or Google hiding the link). You do **not** need App Passwords if you use [Resend](https://resend.com):

1. Sign up at Resend with the same Gmail you want to receive support mail.
2. Create an **API key**.
3. In Vercel → **novablaster-website** → **Settings → Environment Variables** (Production):
   - `SUPPORT_INBOX` = your Gmail (already set if you followed earlier setup)
   - `RESEND_API_KEY` = your Resend API key
4. Redeploy.

Resend’s `onboarding@resend.dev` sender can deliver to the account email on the free tier without verifying a custom domain.

### Gmail App Password (optional fallback)

If you prefer SMTP, open this direct link while signed in:  
**https://myaccount.google.com/apppasswords**

If it says unavailable, use Resend instead and set `RESEND_API_KEY` (SMTP vars not required).

## Turnstile (spam protection)

Create keys at [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) for hostnames `novablaster-website.vercel.app` and `localhost`:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

Replace Cloudflare **test** keys before launch for real bot protection.

## Local development

Copy `.env.example` to `.env.local`, fill values, then:

```bash
npm install
npm run dev
```

## App Store Connect

- **Privacy Policy URL:** `https://novablaster-website.vercel.app/privacy`
- **Support URL:** `https://novablaster-website.vercel.app/support`
