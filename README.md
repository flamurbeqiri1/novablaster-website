# Nova Blaster Website

Public marketing and legal pages for Nova Blaster — App Store **Support URL** and **Privacy Policy URL**, hosted on [Vercel](https://vercel.com).

## Support form

- Mail is sent with **Gmail SMTP** (Google App Password on Vercel).
- The inbox address is only in env vars (`SUPPORT_INBOX`), never on the site.
- **Human check:** simple math question, signed on the server (no Cloudflare or other third-party captcha).
- **Honeypot** field and minimum time before submit help block basic bots.

### Vercel environment variables (Production)

| Variable | Purpose |
|----------|---------|
| `SUPPORT_INBOX` | Your Gmail inbox |
| `SMTP_USER` | Same Gmail address |
| `SMTP_PASS` | Google App Password |
| `SMTP_HOST` | Optional (`smtp.gmail.com`) |
| `SMTP_PORT` | Optional (`465`) |
| `SUPPORT_FORM_SECRET` | Optional; captcha signing (uses `SMTP_PASS` if omitted) |

Redeploy after changing env vars.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

## App Store Connect

- **Privacy:** `https://novablaster-website.vercel.app/privacy`
- **Support:** `https://novablaster-website.vercel.app/support`
