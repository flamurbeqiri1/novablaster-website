import { SupportForm } from "@/components/SupportForm";

export function SupportFormSection() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (!siteKey) {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        The contact form is not available right now. Please try again later.
      </p>
    );
  }

  return <SupportForm siteKey={siteKey} />;
}
