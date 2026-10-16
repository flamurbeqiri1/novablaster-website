"use client";

import { useCallback, useState } from "react";
import type { MathChallenge } from "@/lib/math-captcha";
import { supportMessageTemplate } from "@/lib/support-message-template";
import { SUPPORT_LIMITS } from "@/lib/support-limits";
import {
  firstSupportFieldError,
  hasSupportFieldErrors,
  validateSupportFields,
  type SupportFieldErrors,
} from "@/lib/validate-support-form";

type FormState = "idle" | "submitting" | "success" | "error";

function RequiredMark() {
  return (
    <span className="support-form-required" aria-hidden="true">
      *
    </span>
  );
}

export function SupportForm({ initialChallenge }: { initialChallenge: MathChallenge }) {
  const [challenge, setChallenge] = useState(initialChallenge);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<SupportFieldErrors>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [refreshingCaptcha, setRefreshingCaptcha] = useState(false);
  const [message, setMessage] = useState(supportMessageTemplate);

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
      setFieldErrors((prev) => ({ ...prev, captchaAnswer: undefined }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load a new question.");
    } finally {
      setRefreshingCaptcha(false);
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const errors = validateSupportFields({ name, email, message, captchaAnswer });
    setFieldErrors(errors);

    if (hasSupportFieldErrors(errors)) {
      setFormState("error");
      setErrorMessage(firstSupportFieldError(errors));
      return;
    }

    const payload = {
      name,
      email,
      message,
      company: "",
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

      setName("");
      setEmail("");
      setMessage(supportMessageTemplate);
      setCaptchaAnswer("");
      setFieldErrors({});
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
        <label htmlFor="support-name">
          Name <RequiredMark />
        </label>
        <input
          id="support-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={SUPPORT_LIMITS.nameMax}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFieldErrors((prev) => ({ ...prev, name: undefined }));
          }}
          disabled={formState === "submitting"}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "support-name-error" : undefined}
        />
        {fieldErrors.name ? (
          <p id="support-name-error" className="support-form-field-error" role="alert">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="support-form-field">
        <label htmlFor="support-email">
          Your email <RequiredMark />
        </label>
        <input
          id="support-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={SUPPORT_LIMITS.emailMax}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }}
          disabled={formState === "submitting"}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "support-email-error" : undefined}
        />
        {fieldErrors.email ? (
          <p id="support-email-error" className="support-form-field-error" role="alert">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="support-form-field">
        <label htmlFor="support-message">
          Message <RequiredMark />
        </label>
        <textarea
          id="support-message"
          name="message"
          required
          minLength={SUPPORT_LIMITS.messageMin}
          maxLength={SUPPORT_LIMITS.messageMax}
          rows={12}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setFieldErrors((prev) => ({ ...prev, message: undefined }));
          }}
          disabled={formState === "submitting"}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby="support-message-count support-message-error"
        />
        <p
          id="support-message-count"
          className={`support-form-char-count${message.length >= SUPPORT_LIMITS.messageMax ? " support-form-char-count-limit" : ""}`}
        >
          {message.length.toLocaleString()} / {SUPPORT_LIMITS.messageMax.toLocaleString()} characters
          (minimum {SUPPORT_LIMITS.messageMin})
        </p>
        {fieldErrors.message ? (
          <p id="support-message-error" className="support-form-field-error" role="alert">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <div className="support-form-field support-form-captcha">
        <label htmlFor="support-captcha">
          Human check <RequiredMark />
        </label>
        <p className="support-form-captcha-prompt">{challenge.prompt}</p>
        <div className="support-form-captcha-row">
          <input
            id="support-captcha"
            name="captchaAnswer"
            type="text"
            inputMode="numeric"
            pattern="-?[0-9]+"
            autoComplete="off"
            required
            value={captchaAnswer}
            onChange={(event) => {
              setCaptchaAnswer(event.target.value);
              setFieldErrors((prev) => ({ ...prev, captchaAnswer: undefined }));
            }}
            disabled={formState === "submitting" || refreshingCaptcha}
            aria-invalid={fieldErrors.captchaAnswer ? true : undefined}
            aria-describedby="support-captcha-hint support-captcha-error"
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
        {fieldErrors.captchaAnswer ? (
          <p id="support-captcha-error" className="support-form-field-error" role="alert">
            {fieldErrors.captchaAnswer}
          </p>
        ) : null}
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

      <p className="support-form-required-note">
        <RequiredMark /> Required fields
      </p>

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
