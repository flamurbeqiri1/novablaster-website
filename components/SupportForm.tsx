"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";
import { supportMessageTemplate } from "@/lib/support-message-template";

type FormState = "idle" | "submitting" | "success" | "error";

export function SupportForm({ siteKey }: { siteKey: string }) {
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!turnstileToken) {
      setErrorMessage("Please complete the human check below.");
      setFormState("error");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
      turnstileToken,
    };

    setFormState("submitting");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      form.reset();
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setFormState("success");
    } catch (error) {
      setFormState("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  if (formState === "success") {
    return (
      <div className="support-form-status support-form-status-success" role="status">
        <p style={{ margin: 0 }}>
          Thanks — your message was sent. We&apos;ll reply to the email address you provided.
        </p>
        <button
          type="button"
          className="btn btn-secondary support-form-reset"
          onClick={() => setFormState("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="support-form" onSubmit={onSubmit} noValidate>
      <div className="support-form-field">
        <label htmlFor="support-name">Name</label>
        <input
          id="support-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          disabled={formState === "submitting"}
        />
      </div>

      <div className="support-form-field">
        <label htmlFor="support-email">Your email</label>
        <input
          id="support-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={formState === "submitting"}
        />
      </div>

      <div className="support-form-field">
        <label htmlFor="support-message">Message</label>
        <textarea
          id="support-message"
          name="message"
          required
          maxLength={8000}
          rows={12}
          defaultValue={supportMessageTemplate}
          disabled={formState === "submitting"}
        />
      </div>

      <div className="support-form-honeypot" aria-hidden="true">
        <label htmlFor="support-company">Company</label>
        <input id="support-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="support-form-turnstile">
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
          options={{ theme: "dark", size: "normal" }}
        />
      </div>

      {errorMessage ? (
        <p className="support-form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary support-form-submit"
        disabled={formState === "submitting" || !turnstileToken}
      >
        {formState === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
