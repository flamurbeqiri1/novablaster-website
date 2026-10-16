import nodemailer from "nodemailer";
import { Resend } from "resend";
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

function buildEmailContent(payload: SupportEmailPayload) {
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

  return { subject, text };
}

async function sendViaResend(payload: SupportEmailPayload, inbox: string): Promise<void> {
  const apiKey = requireEnv("RESEND_API_KEY");
  const from =
    process.env.RESEND_FROM?.trim() || `"${siteConfig.name} Support" <onboarding@resend.dev>`;

  const { subject, text } = buildEmailContent(payload);
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: [inbox],
    replyTo: payload.email,
    subject,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function sendViaSmtp(payload: SupportEmailPayload, inbox: string): Promise<void> {
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

  const { subject, text } = buildEmailContent(payload);

  await transporter.sendMail({
    from: `"${siteConfig.name} Support" <${smtpUser}>`,
    to: inbox,
    replyTo: payload.email,
    subject,
    text,
  });
}

export async function sendSupportEmail(payload: SupportEmailPayload): Promise<void> {
  const inbox = requireEnv("SUPPORT_INBOX");

  if (process.env.RESEND_API_KEY?.trim()) {
    await sendViaResend(payload, inbox);
    return;
  }

  await sendViaSmtp(payload, inbox);
}
