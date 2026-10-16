"use client";

import { useCallback, useState } from "react";
import type { MathChallenge } from "@/lib/math-captcha";
import { supportMessageTemplate } from "@/lib/support-message-template";

type FormState = "idle" | "submitting" | "success" | "error";

export function SupportForm({ initialChallenge }: { initialChallenge: MathChallenge }) {
  const [challenge, setChallenge] = useState(initialChallenge);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [refreshingCaptcha, setRefreshingCaptcha] = useState(false);

  const refreshChallenge = useCallback(async () => {
    setRefreshingCaptcha(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/support/challenge");
      const data = (await response.json()) as MathChallenge & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Could not load a new question.");
      }
      setChallenge({ prompt: data.prompt, token: data.token, issuedAt: data.issuedAt });
      setCaptchaAnswer("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load a new question.");
    } finally {
      setRefreshingCaptcha(false);
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!captchaAnswer.trim()) {
      setErrorMessage("Please answer the human check.");
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
      captchaToken: challenge.token,
      captchaAnswer,
      captchaIssuedAt: challenge.issuedAt,
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
      setCaptchaAnswer("");
      setFormState("success");
    } catch (error) {
      setFormState("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
      await refreshChallenge();
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
          onClick={() => {
            void refreshChallenge();
            setFormState("idle");
          }}
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

      <div className="support-form-field support-form-captcha">
        <label htmlFor="support-captcha">Human check</label>
        <p className="support-form-captcha-prompt">{challenge.prompt}</p>
        <div className="support-form-captcha-row">
          <input
            id="support-captcha"
            name="captchaAnswer"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            value={captchaAnswer}
            onChange={(event) => setCaptchaAnswer(event.target.value)}
            disabled={formState === "submitting" || refreshingCaptcha}
            aria-describedby="support-captcha-hint"
          />
          <button
            type="button"
            className="btn btn-secondary support-form-captcha-refresh"
            onClick={() => void refreshChallenge()}
            disabled={formState === "submitting" || refreshingCaptcha}
          >
            New question
          </button>
        </div>
        <p id="support-captcha-hint" className="support-form-captcha-hint">
          Answer the sum so we know you&apos;re not a bot. Wait a few seconds before sending.
        </p>
      </div>

      <div className="support-form-honeypot" aria-hidden="true">
        <label htmlFor="support-company">Company</label>
        <input id="support-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errorMessage ? (
        <p className="support-form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary support-form-submit"
        disabled={formState === "submitting" || refreshingCaptcha}
      >
        {formState === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
