"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../lib/supabase";

type ApplicationType = "standard" | "vip";
type Screen = "home" | "application" | "success";

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  street_address: string;
  zip_code: string;
  why_join: string;
  how_heard: string;
  how_heard_other: string;
  contribution: string;
  presentation_answer: string;
  penguin_answer: string;
  website: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;

const VIP_PIN = "1927";

const EMPTY_FORM: FormValues = {
  first_name: "",
  last_name: "",
  email: "",
  street_address: "",
  zip_code: "",
  why_join: "",
  how_heard: "",
  how_heard_other: "",
  contribution: "",
  presentation_answer: "",
  penguin_answer: "",
  website: "",
};

const HEARD_OPTIONS = [
  "Friend / Member",
  "Instagram",
  "TikTok",
  "Event",
  "Word of mouth",
  "Other",
];

export function MembershipExperience() {
  const [screen, setScreen] = useState<Screen>("home");
  const [applicationType, setApplicationType] =
    useState<ApplicationType>("standard");
  const [vipUnlocked, setVipUnlocked] = useState(false);

  const startApplication = (type: ApplicationType) => {
    setApplicationType(type);
    setVipUnlocked(type === "standard");
    setScreen("application");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const returnHome = () => {
    setScreen("home");
    setVipUnlocked(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="site-shell">
      <div className="ambient-mark" aria-hidden="true">
        PM
      </div>

      {screen === "home" && <HomeScreen onStart={startApplication} />}

      {screen === "application" && (
        <ApplicationScreen
          key={applicationType}
          applicationType={applicationType}
          vipUnlocked={vipUnlocked}
          onUnlock={() => setVipUnlocked(true)}
          onBack={returnHome}
          onSuccess={() => {
            setScreen("success");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {screen === "success" && (
        <SuccessScreen type={applicationType} onReturn={returnHome} />
      )}
    </main>
  );
}

function HomeScreen({
  onStart,
}: {
  onStart: (type: ApplicationType) => void;
}) {
  return (
    <section className="home-screen" aria-labelledby="hero-title">
      <header className="topbar entrance entrance-1">
        <a className="wordmark" href="#main" aria-label="Private Membership home">
          <span className="monogram">P / M</span>
          <span>Private Membership</span>
        </a>
        <div className="topbar-meta" aria-label="Membership details">
          <span>By application</span>
          <span className="topbar-dot" aria-hidden="true" />
          <span>Est. MMXXVI</span>
        </div>
      </header>

      <div className="hero" id="main">
        <p className="eyebrow entrance entrance-2">A considered collective</p>
        <h1 id="hero-title" className="hero-title entrance entrance-3">
          Private
          <span>Membership</span>
        </h1>
        <p className="hero-subtitle entrance entrance-4">
          Apply for access to a curated private community.
        </p>

        <div className="choice-grid entrance entrance-5">
          <button
            className="choice-card"
            type="button"
            onClick={() => onStart("standard")}
          >
            <span className="choice-number">01</span>
            <span className="choice-title">Join the waitlist</span>
            <span className="choice-arrow" aria-hidden="true">
              ↗
            </span>
            <span className="choice-description">
              Submit your application for consideration.
            </span>
          </button>

          <button
            className="choice-card choice-card-vip"
            type="button"
            onClick={() => onStart("vip")}
          >
            <span className="choice-number">02 / Private access</span>
            <span className="choice-title">VIP waitlist</span>
            <span className="choice-arrow" aria-hidden="true">
              ↗
            </span>
            <span className="choice-description">For invitation holders only.</span>
          </button>
        </div>
      </div>

      <footer className="home-footer entrance entrance-5">
        <span>Membership is intentionally limited.</span>
        <span aria-hidden="true">New York · Worldwide</span>
      </footer>
    </section>
  );
}

function ApplicationScreen({
  applicationType,
  vipUnlocked,
  onUnlock,
  onBack,
  onSuccess,
}: {
  applicationType: ApplicationType;
  vipUnlocked: boolean;
  onUnlock: () => void;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const isVip = applicationType === "vip";

  return (
    <section className="application-screen" aria-labelledby="application-title">
      <header className="application-topbar">
        <button className="text-button" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> Return home
        </button>
        <span className={isVip ? "application-chip is-vip" : "application-chip"}>
          {isVip ? "VIP application" : "General application"}
        </span>
        <span className="application-count">10 questions</span>
      </header>

      <div className={isVip ? "vip-stage" : undefined}>
        <div
          className={`application-layout ${isVip && !vipUnlocked ? "is-locked" : ""}`}
          inert={isVip && !vipUnlocked ? true : undefined}
          aria-hidden={isVip && !vipUnlocked}
        >
          <aside className="application-intro">
            <p className="eyebrow">Private intake / 2026</p>
            <h2 id="application-title">
              {isVip ? "VIP" : "Membership"}
              <span>Application</span>
            </h2>
            <p>
              We read every application. Take your time, and answer in your own
              words.
            </p>
            <div className="intro-rule" />
            <small>
              Fields marked <span aria-hidden="true">*</span> are required.
            </small>
          </aside>

          <ApplicationForm
            applicationType={applicationType}
            onSuccess={onSuccess}
          />
        </div>

        {isVip && !vipUnlocked && <VipLock onUnlock={onUnlock} />}
      </div>
    </section>
  );
}

function VipLock({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const unlock = (event: FormEvent) => {
    event.preventDefault();
    if (unlocking) return;

    if (pin !== VIP_PIN) {
      setError(true);
      setPin("");
      inputRef.current?.focus();
      return;
    }

    setError(false);
    setUnlocking(true);
    window.setTimeout(onUnlock, 620);
  };

  return (
    <div className={`vip-lock ${unlocking ? "is-unlocking" : ""}`}>
      <div className="lock-halo" aria-hidden="true" />
      <form className="lock-card" onSubmit={unlock} noValidate>
        <div className="lock-seal" aria-hidden="true">
          VIP
        </div>
        <p className="eyebrow">Private access</p>
        <h2>VIP Waitlist</h2>
        <p className="lock-instruction">Enter your invitation PIN.</p>
        <label className="sr-only" htmlFor="vip-pin">
          Four digit invitation PIN
        </label>
        <input
          ref={inputRef}
          id="vip-pin"
          className={error ? "pin-input has-error" : "pin-input"}
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          value={pin}
          onChange={(event) => {
            setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
            setError(false);
          }}
          aria-invalid={error}
          aria-describedby={error ? "pin-error" : "invitation-only"}
          placeholder="••••"
        />
        <button className="primary-button lock-button" type="submit" disabled={pin.length !== 4 || unlocking}>
          <span>{unlocking ? "Opening" : "Unlock"}</span>
          {unlocking && <span className="spinner" aria-hidden="true" />}
        </button>
        <div className="lock-message" aria-live="polite">
          {error ? (
            <p id="pin-error" className="access-denied">
              <strong>Access denied.</strong>
              Check your invitation PIN.
            </p>
          ) : (
            <p id="invitation-only">Invitation holders only.</p>
          )}
        </div>
      </form>
    </div>
  );
}

function ApplicationForm({
  applicationType,
  onSuccess,
}: {
  applicationType: ApplicationType;
  onSuccess: () => void;
}) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const requiredNames = useMemo<FieldName[]>(
    () => [
      "first_name",
      "last_name",
      "email",
      "street_address",
      "zip_code",
      "presentation_answer",
      "penguin_answer",
    ],
    [],
  );

  const validateField = (name: FieldName, value: string) => {
    const cleanValue = value.trim();
    if (requiredNames.includes(name) && !cleanValue) return "This field is required.";
    if (name === "how_heard_other" && values.how_heard === "Other" && !cleanValue) {
      return "Please tell us how you heard about us.";
    }
    if (
      name === "email" &&
      cleanValue &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(cleanValue)
    ) {
      return "Enter a valid email address.";
    }
    const maxLengths: Partial<Record<FieldName, number>> = {
      first_name: 80,
      last_name: 80,
      email: 320,
      street_address: 200,
      zip_code: 20,
      why_join: 1200,
      how_heard: 80,
      how_heard_other: 72,
      contribution: 1200,
      presentation_answer: 1200,
      penguin_answer: 1200,
    };
    const max = maxLengths[name];
    if (max && value.length > max) return `Keep this answer under ${max} characters.`;
    return "";
  };

  const updateValue = (name: FieldName, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    }
    if (submitError) setSubmitError("");
  };

  const onBlur = (name: FieldName) => {
    const message = validateField(name, values[name]);
    setErrors((current) => ({ ...current, [name]: message }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors: FormErrors = {};
    (Object.keys(values) as FieldName[]).forEach((name) => {
      if (name !== "website") {
        const message = validateField(name, values[name]);
        if (message) nextErrors[name] = message;
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = event.currentTarget.querySelector<HTMLElement>(
        "[aria-invalid='true']",
      );
      firstInvalid?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    if (values.website) {
      window.setTimeout(onSuccess, 500);
      return;
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          application_type: applicationType,
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          email: values.email.trim().toLowerCase(),
          street_address: values.street_address.trim(),
          zip_code: values.zip_code.trim(),
          why_join: values.why_join.trim() || null,
          how_heard:
            values.how_heard === "Other"
              ? `Other: ${values.how_heard_other.trim()}`
              : values.how_heard || null,
          contribution: values.contribution.trim() || null,
          presentation_answer: values.presentation_answer.trim(),
          penguin_answer: values.penguin_answer.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("We could not submit your application at this time.");
      }

      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit your application at this time.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form className="application-form" onSubmit={submit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => updateValue("website", event.target.value)}
        />
      </div>

      <div className="field-pair">
        <FormField
          number="01"
          label="First Name"
          name="first_name"
          required
          value={values.first_name}
          error={errors.first_name}
          autoComplete="given-name"
          onChange={updateValue}
          onBlur={onBlur}
        />
        <FormField
          number="02"
          label="Last Name"
          name="last_name"
          required
          value={values.last_name}
          error={errors.last_name}
          autoComplete="family-name"
          onChange={updateValue}
          onBlur={onBlur}
        />
      </div>

      <FormField
        number="03"
        label="Email Address"
        name="email"
        type="email"
        required
        value={values.email}
        error={errors.email}
        autoComplete="email"
        inputMode="email"
        onChange={updateValue}
        onBlur={onBlur}
      />

      <FormField
        number="04"
        label="Street Address"
        name="street_address"
        required
        value={values.street_address}
        error={errors.street_address}
        autoComplete="street-address"
        onChange={updateValue}
        onBlur={onBlur}
      />

      <FormField
        number="05"
        label="ZIP Code"
        name="zip_code"
        required
        value={values.zip_code}
        error={errors.zip_code}
        autoComplete="postal-code"
        inputMode="text"
        onChange={updateValue}
        onBlur={onBlur}
      />

      <TextareaField
        number="06"
        label="Why do you want to be part of this community?"
        name="why_join"
        value={values.why_join}
        error={errors.why_join}
        maxLength={1200}
        onChange={updateValue}
        onBlur={onBlur}
      />

      <div className="field-block">
        <label className="field-label" htmlFor="how_heard">
          <span className="field-number">07</span>
          <span>How did you hear about us?</span>
        </label>
        <div className="select-wrap">
          <select
            id="how_heard"
            name="how_heard"
            value={values.how_heard}
            onChange={(event) => {
              updateValue("how_heard", event.target.value);
              if (event.target.value !== "Other") {
                updateValue("how_heard_other", "");
              }
            }}
            onBlur={() => onBlur("how_heard")}
            aria-invalid={Boolean(errors.how_heard)}
            aria-describedby={errors.how_heard ? "how_heard-error" : undefined}
          >
            <option value="">Select an option</option>
            {HEARD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span aria-hidden="true">↓</span>
        </div>
        {errors.how_heard && (
          <p className="field-error" id="how_heard-error">
            {errors.how_heard}
          </p>
        )}
        {values.how_heard === "Other" && (
          <div className="other-source-field">
            <label className="field-label" htmlFor="how_heard_other">
              <span>Please specify</span>
              <span className="required-mark"> *</span>
            </label>
            <input
              id="how_heard_other"
              name="how_heard_other"
              type="text"
              value={values.how_heard_other}
              maxLength={72}
              placeholder="Tell us where you found us"
              onChange={(event) => updateValue("how_heard_other", event.target.value)}
              onBlur={() => onBlur("how_heard_other")}
              aria-invalid={Boolean(errors.how_heard_other)}
              aria-describedby={
                errors.how_heard_other ? "how_heard_other-error" : undefined
              }
            />
            {errors.how_heard_other && (
              <p className="field-error" id="how_heard_other-error">
                {errors.how_heard_other}
              </p>
            )}
          </div>
        )}
      </div>

      <TextareaField
        number="08"
        label="How would you contribute to the group?"
        name="contribution"
        value={values.contribution}
        error={errors.contribution}
        maxLength={1200}
        onChange={updateValue}
        onBlur={onBlur}
      />

      <section className="last-thing" aria-labelledby="last-thing-heading">
        <p className="eyebrow" id="last-thing-heading">
          09 — One last thing
        </p>
        <p className="random-question">
          What is something you could give a <em>20-minute presentation</em> about
          with zero preparation?
        </p>
        <label className="sr-only" htmlFor="presentation_answer">
          Your answer to: What is something you could give a 20-minute presentation
          about with zero preparation?
        </label>
        <textarea
          id="presentation_answer"
          name="presentation_answer"
          value={values.presentation_answer}
          maxLength={1200}
          rows={6}
          placeholder="Your answer..."
          onChange={(event) => updateValue("presentation_answer", event.target.value)}
          onBlur={() => onBlur("presentation_answer")}
          aria-invalid={Boolean(errors.presentation_answer)}
          aria-describedby={
            errors.presentation_answer
              ? "presentation_answer-error"
              : "presentation_answer-meta"
          }
        />
        <div className="field-meta" id="presentation_answer-meta">
          <span>Required</span>
          <span>{values.presentation_answer.length} / 1200</span>
        </div>
        {errors.presentation_answer && (
          <p className="field-error" id="presentation_answer-error">
            {errors.presentation_answer}
          </p>
        )}
      </section>

      <section className="last-thing" aria-labelledby="penguin-heading">
        <p className="eyebrow" id="penguin-heading">
          10 — Final question
        </p>
        <p className="random-question">
          You have been given a penguin. You cannot sell it or give it away.
          <em>What do you do?</em>
        </p>
        <label className="sr-only" htmlFor="penguin_answer">
          Your answer to: You have been given a penguin. You cannot sell it or give
          it away. What do you do?
        </label>
        <textarea
          id="penguin_answer"
          name="penguin_answer"
          value={values.penguin_answer}
          maxLength={1200}
          rows={6}
          placeholder="Your answer..."
          onChange={(event) => updateValue("penguin_answer", event.target.value)}
          onBlur={() => onBlur("penguin_answer")}
          aria-invalid={Boolean(errors.penguin_answer)}
          aria-describedby={
            errors.penguin_answer ? "penguin_answer-error" : "penguin_answer-meta"
          }
        />
        <div className="field-meta" id="penguin_answer-meta">
          <span>There is no correct answer. Probably.</span>
          <span>{values.penguin_answer.length} / 1200</span>
        </div>
        {errors.penguin_answer && (
          <p className="field-error" id="penguin_answer-error">
            {errors.penguin_answer}
          </p>
        )}
      </section>

      {submitError && (
        <p className="submit-error" role="alert">
          {submitError} Please try again.
        </p>
      )}

      <div className="submit-row">
        <p>
          By submitting, you confirm that the information provided is accurate.
        </p>
        <button className="primary-button submit-button" type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? "Submitting" : "Submit application"}</span>
          {isSubmitting ? (
            <span className="spinner" aria-hidden="true" />
          ) : (
            <span aria-hidden="true">↗</span>
          )}
        </button>
      </div>
    </form>
  );
}

function FormField({
  number,
  label,
  name,
  value,
  error,
  required,
  type = "text",
  autoComplete,
  inputMode,
  onChange,
  onBlur,
}: {
  number: string;
  label: string;
  name: FieldName;
  value: string;
  error?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email";
  onChange: (name: FieldName, value: string) => void;
  onBlur: (name: FieldName) => void;
}) {
  const errorId = `${name}-error`;
  return (
    <div className="field-block">
      <label className="field-label" htmlFor={name}>
        <span className="field-number">{number}</span>
        <span>
          {label}
          {required && <span className="required-mark"> *</span>}
        </span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={name === "email" ? 320 : name === "street_address" ? 200 : name === "zip_code" ? 20 : 80}
        onChange={(event) => onChange(name, event.target.value)}
        onBlur={() => onBlur(name)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

function TextareaField({
  number,
  label,
  name,
  value,
  error,
  maxLength,
  onChange,
  onBlur,
}: {
  number: string;
  label: string;
  name: "why_join" | "contribution";
  value: string;
  error?: string;
  maxLength: number;
  onChange: (name: FieldName, value: string) => void;
  onBlur: (name: FieldName) => void;
}) {
  const errorId = `${name}-error`;
  const metaId = `${name}-meta`;
  return (
    <div className="field-block">
      <label className="field-label" htmlFor={name}>
        <span className="field-number">{number}</span>
        <span>{label}</span>
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        maxLength={maxLength}
        rows={5}
        onChange={(event) => onChange(name, event.target.value)}
        onBlur={() => onBlur(name)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : metaId}
      />
      <div className="field-meta" id={metaId}>
        <span>Optional</span>
        <span>{value.length} / {maxLength}</span>
      </div>
      {error && (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

function SuccessScreen({
  type,
  onReturn,
}: {
  type: ApplicationType;
  onReturn: () => void;
}) {
  const isVip = type === "vip";
  return (
    <section className="success-screen" aria-labelledby="success-title">
      <div className="success-orbit" aria-hidden="true">
        <span />
      </div>
      <div className="success-content">
        <p className="eyebrow">Submission confirmed</p>
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>
        <h1 id="success-title">
          {isVip ? "VIP Application" : "Application"}
          <span>Received</span>
        </h1>
        <p>
          {isVip ? (
            <>Your application has been submitted.</>
          ) : (
            <>
              Thank you for applying.
              <br />
              If selected, we will contact you using the email provided.
            </>
          )}
        </p>
        <button className="primary-button" type="button" onClick={onReturn}>
          <span>Return home</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className="success-footer">Private Membership · 2026</p>
    </section>
  );
}
