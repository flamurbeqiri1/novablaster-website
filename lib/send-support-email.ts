import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site";

export type SupportEmailPayload = {
  name: string;
  email: string;
  message: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export async function sendSupportEmail(payload: SupportEmailPayload): Promise<void> {
  const inbox = requireEnv("SUPPORT_INBOX");
  const smtpUser = requireEnv("SMTP_USER");
  const smtpPass = requireEnv("SMTP_PASS");
  const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT ?? "465");

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subject = `[${siteConfig.name} Support] Message from ${payload.name}`;
  const text = [
    `Name: ${payload.name}`,
    `Reply-To: ${payload.email}`,
    "",
    payload.message,
    "",
    "---",
    `Sent via ${siteConfig.url}/support`,
  ].join("\n");

  await transporter.sendMail({
    from: `"${siteConfig.name} Support" <${smtpUser}>`,
    to: inbox,
    replyTo: payload.email,
    subject,
    text,
  });
}
