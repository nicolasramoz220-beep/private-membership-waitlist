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
  contribution: string;
  random_answer: string;
  website: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;

const VIP_PIN = "1927";

const QUESTIONS = [
  {
    value:
      "What is something you could give a 20-minute presentation about with zero preparation?",
    lines: (
      <>
        What is something you could give a <em>20-minute presentation</em> about
        with zero preparation?
      </>
    ),
    note: null,
  },
  {
    value:
      "You have been given a penguin. You cannot sell it or give it away. What do you do?",
    lines: (
      <>
        You have been given a penguin. You cannot sell it or give it away.
        <em>What do you do?</em>
      </>
    ),
    note: "There is no correct answer. Probably.",
  },
] as const;

const EMPTY_FORM: FormValues = {
  first_name: "",
  last_name: "",
  email: "",
  street_address: "",
  zip_code: "",
  why_join: "",
  how_heard: "",
  contribution: "",
  random_answer: "",
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

function pickQuestion() {
  return Math.random() < 0.5 ? 0 : 1;
}

export function MembershipExperience() {
  const [screen, setScreen] = useState<Screen>("home");
  const [applicationType, setApplicationType] =
    useState<ApplicationType>("standard");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [vipUnlocked, setVipUnlocked] = useState(false);

  const startApplication = (type: ApplicationType) => {
    setApplicationType(type);
    setQuestionIndex(pickQuestion());
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
          key={`${applicationType}-${questionIndex}`}
          applicationType={applicationType}
          questionIndex={questionIndex}
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
  questionIndex,
  vipUnlocked,
  onUnlock,
  onBack,
  onSuccess,
}: {
  applicationType: ApplicationType;
  questionIndex: number;
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
        <span className="application-count">09 questions</span>
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
            questionIndex={questionIndex}
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
  questionIndex,
  onSuccess,
}: {
  applicationType: ApplicationType;
  questionIndex: number;
  onSuccess: () => void;
}) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const question = QUESTIONS[questionIndex];

  const requiredNames = useMemo<FieldName[]>(
    () => [
      "first_name",
      "last_name",
      "email",
      "street_address",
      "zip_code",
      "random_answer",
    ],
    [],
  );

  const validateField = (name: FieldName, value: string) => {
    const cleanValue = value.trim();
    if (requiredNames.includes(name) && !cleanValue) return "This field is required.";
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
      contribution: 1200,
      random_answer: 1200,
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
          how_heard: values.how_heard || null,
          contribution: values.contribution.trim() || null,
          random_question: question.value,
          random_answer: values.random_answer.trim(),
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
            onChange={(event) => updateValue("how_heard", event.target.value)}
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
        <p className="random-question">{question.lines}</p>
        <label className="sr-only" htmlFor="random_answer">
          Your answer to: {question.value}
        </label>
        <textarea
          id="random_answer"
          name="random_answer"
          value={values.random_answer}
          maxLength={1200}
          rows={6}
          placeholder="Your answer..."
          onChange={(event) => updateValue("random_answer", event.target.value)}
          onBlur={() => onBlur("random_answer")}
          aria-invalid={Boolean(errors.random_answer)}
          aria-describedby={
            errors.random_answer ? "random_answer-error" : "random_answer-meta"
          }
        />
        <div className="field-meta" id="random_answer-meta">
          <span>{question.note}</span>
          <span>{values.random_answer.length} / 1200</span>
        </div>
        {errors.random_answer && (
          <p className="field-error" id="random_answer-error">
            {errors.random_answer}
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
