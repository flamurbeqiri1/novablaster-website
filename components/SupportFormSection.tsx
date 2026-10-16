import { SupportForm } from "@/components/SupportForm";
import { createMathChallenge } from "@/lib/math-captcha";

export function SupportFormSection() {
  try {
    const challenge = createMathChallenge();
    return <SupportForm initialChallenge={challenge} />;
  } catch {
    return (
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        The contact form is not available right now. Please try again later.
      </p>
    );
  }
}
