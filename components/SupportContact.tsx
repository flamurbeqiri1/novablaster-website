import { supportEmailOrNull } from "@/lib/site";

export function SupportContact({ compact = false }: { compact?: boolean }) {
  const email = supportEmailOrNull();

  if (email) {
    return (
      <a href={`mailto:${email}`}>{email}</a>
    );
  }

  return (
    <span style={{ color: "var(--text-muted)" }}>
      {compact ? "Email coming soon" : "A public support email will be posted here before App Store release."}
    </span>
  );
}
