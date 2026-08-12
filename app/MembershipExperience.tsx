"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
  trustworthiness: string;
  organization_trust: string;
  organization_reputation: string;
  unique_contribution: string;
  worthy_of_trust: string;
  three_specific_things: string;
  presentation_topic: string;
  giraffe_plan: string;
  penguin_answer: string;
  million_dollar_plan: string;
  nicolas_choice: string;
  website: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;

const VIP_PIN = "1927";
const STORAGE_KEY = "private-membership-application-draft";
const REVIEW_STEP = 12;

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
  trustworthiness: "",
  organization_trust: "",
  organization_reputation: "",
  unique_contribution: "",
  worthy_of_trust: "",
  three_specific_things: "",
  presentation_topic: "",
  giraffe_plan: "",
  penguin_answer: "",
  million_dollar_plan: "",
  nicolas_choice: "",
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

const STEP_FIELDS: FieldName[][] = [
  ["first_name", "last_name", "email", "street_address", "zip_code"],
  ["why_join", "how_heard", "contribution"],
  ["organization_trust", "organization_reputation"],
  ["trustworthiness"],
  ["unique_contribution", "worthy_of_trust"],
  ["giraffe_plan"],
  ["three_specific_things"],
  ["presentation_topic"],
  ["penguin_answer"],
  ["million_dollar_plan"],
  ["nicolas_choice"],
  [],
  [],
];

const STEP_LABELS = [
  "Identity",
  "Intent",
  "The organization",
  "Trust",
  "What you bring",
  "Important question",
  "Personal detail",
  "Unexpected expertise",
  "Unexpected responsibility",
  "The scenario",
  "Be honest",
  "Declaration",
  "Review",
];

const REVIEW_LINES = [
  ["Checking honesty", "questionable"],
  ["Reviewing life choices", "concerning"],
  ["Evaluating giraffe strategy", "surprisingly solid"],
  ["Checking name quality", "unfortunate"],
  ["Verifying Nicolas preference", "correct"],
] as const;

function loadDraft(): {
  values: FormValues;
  nameConfirmed: boolean;
  escapeCount: number;
  giraffeConfirmed: boolean;
  restrictedSeen: boolean;
} {
  if (typeof window === "undefined") {
    return { values: EMPTY_FORM, nameConfirmed: false, escapeCount: 0, giraffeConfirmed: false, restrictedSeen: false };
  }

  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return { values: EMPTY_FORM, nameConfirmed: false, escapeCount: 0, giraffeConfirmed: false, restrictedSeen: false };
    const parsed = JSON.parse(saved) as Partial<{
      values: Partial<FormValues>;
      nameConfirmed: boolean;
      escapeCount: number;
      giraffeConfirmed: boolean;
      restrictedSeen: boolean;
    }>;
    return {
      values: { ...EMPTY_FORM, ...parsed.values, website: "" },
      nameConfirmed: Boolean(parsed.nameConfirmed),
      escapeCount: Math.min(2, Math.max(0, parsed.escapeCount || 0)),
      giraffeConfirmed: Boolean(parsed.giraffeConfirmed),
      restrictedSeen: Boolean(parsed.restrictedSeen),
    };
  } catch {
    return { values: EMPTY_FORM, nameConfirmed: false, escapeCount: 0, giraffeConfirmed: false, restrictedSeen: false };
  }
}

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

      {screen === "success" && <SuccessScreen onReturn={returnHome} />}
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
          <button className="choice-card" type="button" onClick={() => onStart("standard")}>
            <span className="choice-number">01</span>
            <span className="choice-title">Join the waitlist</span>
            <span className="choice-arrow" aria-hidden="true">↗</span>
            <span className="choice-description">Submit your application for consideration.</span>
          </button>
          <button
            className="choice-card choice-card-vip"
            type="button"
            onClick={() => onStart("vip")}
          >
            <span className="choice-number">02 / Private access</span>
            <span className="choice-title">VIP waitlist</span>
            <span className="choice-arrow" aria-hidden="true">↗</span>
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
        <span className="application-count">Private intake / 2026</span>
      </header>

      <div className={isVip ? "vip-stage" : undefined}>
        <div
          className={`application-layout application-layout-flow ${isVip && !vipUnlocked ? "is-locked" : ""}`}
          inert={isVip && !vipUnlocked ? true : undefined}
          aria-hidden={isVip && !vipUnlocked}
        >
          <aside className="application-intro">
            <p className="eyebrow">Private intake / 2026</p>
            <h2 id="application-title">
              {isVip ? "VIP" : "Membership"}
              <span>Application</span>
            </h2>
            <p>We read every application. Take your time, and answer in your own words.</p>
            <div className="intro-rule" />
            <small>
              All fields are required. Short answers are accepted.
            </small>
          </aside>

          <ApplicationFlow applicationType={applicationType} onSuccess={onSuccess} />
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
        <div className="lock-seal" aria-hidden="true">VIP</div>
        <p className="eyebrow">Private access</p>
        <h2>VIP Waitlist</h2>
        <p className="lock-instruction">Enter your invitation PIN.</p>
        <label className="sr-only" htmlFor="vip-pin">Four digit invitation PIN</label>
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

function ApplicationFlow({
  applicationType,
  onSuccess,
}: {
  applicationType: ApplicationType;
  onSuccess: () => void;
}) {
  const [initialDraft] = useState(() => loadDraft());
  const [values, setValues] = useState<FormValues>(initialDraft.values);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [validationMessage, setValidationMessage] = useState("");
  const [stepReaction, setStepReaction] = useState("");
  const [nameConfirmed, setNameConfirmed] = useState(initialDraft.nameConfirmed);
  const [nameModal, setNameModal] = useState<"closed" | "confirm" | "accepted">("closed");
  const [kingAttempts, setKingAttempts] = useState(0);
  const [kingReaction, setKingReaction] = useState("");
  const [escapeCount, setEscapeCount] = useState(initialDraft.escapeCount);
  const [escapeReaction, setEscapeReaction] = useState("");
  const [giraffeConfirmed, setGiraffeConfirmed] = useState(initialDraft.giraffeConfirmed);
  const [declarationReaction, setDeclarationReaction] = useState("");
  const [confidentialPending, setConfidentialPending] = useState(false);
  const [restrictedOpen, setRestrictedOpen] = useState(false);
  const [restrictedSeen, setRestrictedSeen] = useState(initialDraft.restrictedSeen);
  const [restrictedFast, setRestrictedFast] = useState(false);
  const [restrictedDenied, setRestrictedDenied] = useState(initialDraft.restrictedSeen);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewReady, setReviewReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const validationAttemptsRef = useRef<Record<number, number>>({});
  const completedStepsRef = useRef(new Set<number>());
  const editedFieldsRef = useRef<Partial<Record<FieldName, number>>>({});
  const reactionTimerRef = useRef<number | null>(null);
  const reviewTimersRef = useRef<number[]>([]);
  const nameTimerRef = useRef<number | null>(null);
  const confidentialTimerRef = useRef<number | null>(null);
  const confidentialSeenRef = useRef(false);
  const restrictedScrollRef = useRef(0);

  useEffect(() => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ values: { ...values, website: "" }, nameConfirmed, escapeCount, giraffeConfirmed, restrictedSeen }),
    );
  }, [values, nameConfirmed, escapeCount, giraffeConfirmed, restrictedSeen]);

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
      if (nameTimerRef.current) window.clearTimeout(nameTimerRef.current);
      if (confidentialTimerRef.current) window.clearTimeout(confidentialTimerRef.current);
      reviewTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const showReaction = (message: string) => {
    setStepReaction(message);
    if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = window.setTimeout(() => setStepReaction(""), 2800);
  };

  const updateValue = (name: FieldName, value: string) => {
    const oldValue = values[name];
    setValues((current) => ({ ...current, [name]: value }));
    setSubmitError("");

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }

    if (name === "first_name" && oldValue !== value && nameConfirmed) {
      setNameConfirmed(false);
    }

    const fieldStep = STEP_FIELDS.findIndex((fields) => fields.includes(name));
    if (oldValue && oldValue !== value && completedStepsRef.current.has(fieldStep)) {
      const edits = (editedFieldsRef.current[name] || 0) + 1;
      editedFieldsRef.current[name] = edits;
      if (edits === 1) showReaction("Interesting. Changing the story already.");
      if (edits === 2) showReaction("This story keeps evolving.");
    }
  };

  const validateField = (name: FieldName, value: string) => {
    const clean = value.trim();
    if (!clean) return "This field is required.";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(clean)) {
      return "Enter a valid email address.";
    }
    return "";
  };

  const validateStep = (stepToValidate: number) => {
    if (stepToValidate === 11 && !giraffeConfirmed) {
      const attempt = (validationAttemptsRef.current[stepToValidate] || 0) + 1;
      validationAttemptsRef.current[stepToValidate] = attempt;
      const playful = ["You forgot something.", "You had one job.", "We literally just talked about this."];
      setValidationMessage(playful[attempt - 1] || "Complete the required declaration.");
      window.requestAnimationFrame(() => document.getElementById("giraffe_declaration")?.focus());
      return false;
    }

    const fields = [...STEP_FIELDS[stepToValidate]];
    if (stepToValidate === 1 && values.how_heard === "Other") {
      fields.push("how_heard_other");
    }

    const nextErrors: FormErrors = {};
    fields.forEach((name) => {
      const message = validateField(name, values[name]);
      if (message) nextErrors[name] = message;
    });

    if (Object.keys(nextErrors).length === 0) {
      setErrors({});
      setValidationMessage("");
      return true;
    }

    const attempt = (validationAttemptsRef.current[stepToValidate] || 0) + 1;
    validationAttemptsRef.current[stepToValidate] = attempt;
    const playful = ["You forgot something.", "You had one job.", "We literally just talked about this."];
    const message = playful[attempt - 1] || "Complete the required fields.";
    setErrors(nextErrors);
    setValidationMessage(message);

    window.requestAnimationFrame(() => {
      const firstName = Object.keys(nextErrors)[0];
      document.getElementById(firstName)?.focus();
      document.getElementById(firstName)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return false;
  };

  const moveToStep = (nextStep: number) => {
    if (nextStep === 2 && !confidentialSeenRef.current) {
      confidentialSeenRef.current = true;
      setConfidentialPending(true);
      const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 80 : 1550;
      confidentialTimerRef.current = window.setTimeout(() => setConfidentialPending(false), duration);
    } else {
      setConfidentialPending(false);
    }
    setStep(nextStep);
    setErrors({});
    setValidationMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const continueAfterName = () => {
    setNameConfirmed(true);
    setNameModal("accepted");
    nameTimerRef.current = window.setTimeout(() => {
      setNameModal("closed");
      completedStepsRef.current.add(0);
      moveToStep(1);
    }, 950);
  };

  const beginReview = () => {
    moveToStep(REVIEW_STEP);
    setReviewIndex(0);
    setReviewReady(false);
    reviewTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    reviewTimersRef.current = REVIEW_LINES.map((_, index) =>
      window.setTimeout(() => setReviewIndex(index + 1), 350 + index * 430),
    );
    reviewTimersRef.current.push(window.setTimeout(() => setReviewReady(true), 2850));
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (step === 0 && !nameConfirmed) {
      setNameModal("confirm");
      return;
    }
    completedStepsRef.current.add(step);
    if (step === 11) {
      beginReview();
      return;
    }
    moveToStep(Math.min(REVIEW_STEP, step + 1));
  };

  const handleContinue = () => {
    if (step === 5 && escapeCount < 2) {
      const nextCount = escapeCount + 1;
      setEscapeCount(nextCount);
      setEscapeReaction(nextCount === 1 ? "Too slow." : "Oof... almost.");
      return;
    }
    goNext();
  };

  const openRestricted = () => {
    restrictedScrollRef.current = window.scrollY;
    setRestrictedFast(restrictedSeen);
    setRestrictedSeen(true);
    setRestrictedOpen(true);
  };

  const closeRestricted = () => {
    setRestrictedOpen(false);
    setRestrictedDenied(true);
    window.requestAnimationFrame(() => window.scrollTo({ top: restrictedScrollRef.current, behavior: "auto" }));
  };

  const goBack = () => {
    if (step <= 0) return;
    if (step === REVIEW_STEP) {
      reviewTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      setReviewReady(false);
    }
    showReaction("Having second thoughts?");
    moveToStep(step - 1);
  };

  const chooseKing = (choice: "applicant" | "nicolas") => {
    if (choice === "nicolas") {
      updateValue("nicolas_choice", "King Nicolas");
      setKingReaction("Finally, an intelligent answer.");
      return;
    }
    const attempts = kingAttempts + 1;
    setKingAttempts(attempts);
    setValues((current) => ({ ...current, nicolas_choice: "" }));
    setKingReaction(
      attempts === 1
        ? "Keep dreaming."
        : "Confidence is admirable. Delusion isn't.",
    );
  };

  const submitApplication = async () => {
    if (isSubmitting || !reviewReady) return;
    setIsSubmitting(true);
    setSubmitError("");

    if (values.website) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.setTimeout(onSuccess, 400);
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
          why_join: values.why_join.trim(),
          how_heard:
            values.how_heard === "Other"
              ? `Other: ${values.how_heard_other.trim()}`
              : values.how_heard,
          contribution: values.contribution.trim(),
          trustworthiness: Number(values.trustworthiness),
          organization_trust: values.organization_trust.trim(),
          organization_reputation: values.organization_reputation.trim(),
          unique_contribution: values.unique_contribution.trim(),
          worthy_of_trust: values.worthy_of_trust.trim(),
          three_specific_things: values.three_specific_things.trim(),
          presentation_topic: values.presentation_topic.trim(),
          giraffe_plan: values.giraffe_plan.trim(),
          penguin_answer: values.penguin_answer.trim(),
          million_dollar_plan: values.million_dollar_plan.trim(),
          nicolas_choice: values.nicolas_choice,
          giraffe_declaration: giraffeConfirmed,
        }),
      });

      if (!response.ok) throw new Error("We could not submit your application at this time.");
      window.sessionStorage.removeItem(STORAGE_KEY);
      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "We could not submit your application at this time.",
      );
      setIsSubmitting(false);
    }
  };

  const firstName = values.first_name.trim() || "You";
  const escapeOffset = escapeCount === 1 ? "escape-right" : escapeCount === 2 ? "escape-left" : "";

  return (
    <form className="application-form application-flow" onSubmit={(event) => event.preventDefault()} noValidate>
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

      <div className="flow-progress" aria-label={`Step ${step + 1} of ${STEP_LABELS.length}`}>
        <span>{String(step + 1).padStart(2, "0")} / {String(STEP_LABELS.length).padStart(2, "0")}</span>
        <span>{STEP_LABELS[step]}</span>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }} />
        </div>
      </div>

      <div key={step} className="step-panel">
        {step === 0 && (
          <>
            <StepHeading eyebrow="01 — Basic information" title="Tell us who you are." />
            <div className="field-pair">
              <FormField number="01" label="First Name" name="first_name" value={values.first_name} error={errors.first_name} autoComplete="given-name" onChange={updateValue} />
              <FormField number="02" label="Last Name" name="last_name" value={values.last_name} error={errors.last_name} autoComplete="family-name" onChange={updateValue} />
            </div>
            <FormField number="03" label="Email Address" name="email" type="email" value={values.email} error={errors.email} autoComplete="email" inputMode="email" onChange={updateValue} />
            <FormField number="04" label="Street Address" name="street_address" value={values.street_address} error={errors.street_address} autoComplete="street-address" onChange={updateValue} />
            <FormField number="05" label="ZIP Code" name="zip_code" value={values.zip_code} error={errors.zip_code} autoComplete="postal-code" onChange={updateValue} />
          </>
        )}

        {step === 1 && (
          <>
            <StepHeading eyebrow="02 — Intent" title="A little context." />
            <TextareaField label="Why do you want to be part of this community?" name="why_join" value={values.why_join} error={errors.why_join} reaction={answerReaction(values.why_join)} onChange={updateValue} />
            <div className="field-block">
              <label className="field-label" htmlFor="how_heard"><span>How did you hear about us?</span><span className="required-mark"> *</span></label>
              <div className="select-wrap">
                <select
                  id="how_heard"
                  name="how_heard"
                  value={values.how_heard}
                  onChange={(event) => {
                    updateValue("how_heard", event.target.value);
                    if (event.target.value !== "Other") updateValue("how_heard_other", "");
                  }}
                  aria-invalid={Boolean(errors.how_heard)}
                  aria-describedby={errors.how_heard ? "how_heard-error" : undefined}
                >
                  <option value="">Select an option</option>
                  {HEARD_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <span aria-hidden="true">↓</span>
              </div>
              {errors.how_heard && <p className="field-error" id="how_heard-error">{errors.how_heard}</p>}
              {values.how_heard === "Other" && (
                <div className="other-source-field">
                  <FormField label="Please specify" name="how_heard_other" value={values.how_heard_other} error={errors.how_heard_other} onChange={updateValue} />
                </div>
              )}
            </div>
            <TextareaField label="How would you contribute to the group?" name="contribution" value={values.contribution} error={errors.contribution} reaction={answerReaction(values.contribution)} onChange={updateValue} />
          </>
        )}

        {step === 2 && (
          confidentialPending ? (
            <ConfidentialTransition firstName={firstName} />
          ) : (
            <>
              <StepHeading eyebrow="03 — The organization" title="Trust is earned slowly." />
              <TextareaField label="You’re invited into a private group where not everything is explained immediately. What would make you trust the people inside enough to stay?" name="organization_trust" value={values.organization_trust} error={errors.organization_trust} onChange={updateValue} />
              <TextareaField label="Imagine you’ve been part of this organization for a year. What would you want the other members to know you for?" name="organization_reputation" value={values.organization_reputation} error={errors.organization_reputation} onChange={updateValue} />
            </>
          )
        )}

        {step === 3 && (
          <>
            <StepHeading eyebrow="04 — Trust" title="On a scale from 1–10, how trustworthy are you?" />
            <TrustScale value={values.trustworthiness} error={errors.trustworthiness} onChange={(value) => updateValue("trustworthiness", value)} />
          </>
        )}

        {step === 4 && (
          <>
            <StepHeading eyebrow="05 — What you bring" title="Every member changes the room." />
            <TextareaField label="Every member of this organization is expected to bring something others don’t. What would people eventually realize you bring to the room?" name="unique_contribution" value={values.unique_contribution} error={errors.unique_contribution} onChange={updateValue} />
            <TextareaField label="If this organization trusted you with something important that nobody else could know, what would make you worthy of that trust?" name="worthy_of_trust" value={values.worthy_of_trust} error={errors.worthy_of_trust} onChange={updateValue} />
            <RestrictedAccessLink denied={restrictedDenied} onOpen={openRestricted} />
          </>
        )}

        {step === 5 && (
          <>
            <p className="personalized-transition">Alright, <strong>{firstName}</strong>.<span>Time for something important.</span></p>
            <StepHeading eyebrow="Important question" title="You have 30 minutes to hide a giraffe from the government." subtitle="What’s your plan?" />
            <TextareaField label="Your giraffe strategy" name="giraffe_plan" value={values.giraffe_plan} error={errors.giraffe_plan} reaction={giraffeReaction(values.giraffe_plan)} onChange={updateValue} spacious />
          </>
        )}

        {step === 6 && (
          <>
            <StepHeading eyebrow="07 — Personal detail" title="Specifics reveal more than adjectives." />
            <TextareaField label="If someone who knows you really well had to describe you using only three very specific things you do, what would they say?" name="three_specific_things" value={values.three_specific_things} error={errors.three_specific_things} reaction={answerReaction(values.three_specific_things)} onChange={updateValue} />
          </>
        )}

        {step === 7 && (
          <>
            <StepHeading eyebrow="08 — Unexpected expertise" title="What is something you could give a 20-minute presentation about with zero preparation — and why?" />
            <TextareaField label="Your topic and why you chose it" name="presentation_topic" value={values.presentation_topic} error={errors.presentation_topic} reaction={answerReaction(values.presentation_topic)} onChange={updateValue} spacious />
          </>
        )}

        {step === 8 && (
          <>
            <StepHeading eyebrow="09 — Unexpected responsibility" title="You have been given a penguin." subtitle="You cannot sell it or give it away. What do you do?" />
            <TextareaField label="Your penguin plan" name="penguin_answer" value={values.penguin_answer} error={errors.penguin_answer} reaction={answerReaction(values.penguin_answer)} onChange={updateValue} spacious />
          </>
        )}

        {step === 9 && (
          <>
            <StepHeading eyebrow="10 — The scenario" title="You wake up tomorrow with $1,000,000 in your bank account." subtitle="No explanation. No sender. No message. The only note says: “You have 24 hours. Make it count.” After 24 hours, whatever money is still in the account disappears. What’s your plan?" />
            <TextareaField label="Your plan" name="million_dollar_plan" value={values.million_dollar_plan} error={errors.million_dollar_plan} onChange={updateValue} spacious />
          </>
        )}

        {step === 10 && (
          <KingNicolas
            firstName={firstName}
            selected={values.nicolas_choice === "King Nicolas"}
            reaction={kingReaction}
            onChoose={chooseKing}
          />
        )}

        {step === 11 && (
          <GiraffeDeclaration
            firstName={firstName}
            checked={giraffeConfirmed}
            reaction={declarationReaction}
            onChange={(checked) => {
              setGiraffeConfirmed(checked);
              setDeclarationReaction(checked ? "Good. We would've known." : "");
              if (checked) setValidationMessage("");
            }}
          />
        )}

        {step === REVIEW_STEP && (
          <ReviewPanel firstName={firstName} visibleLines={reviewIndex} ready={reviewReady} />
        )}
      </div>

      <div className="flow-live-region" aria-live="polite">
        {validationMessage || stepReaction || escapeReaction}
      </div>
      {validationMessage && <p className="validation-banner" role="alert">{validationMessage}</p>}

      {step < REVIEW_STEP && (
        <div className="flow-navigation">
          <button className="text-button flow-back" type="button" onClick={goBack} disabled={step === 0}>
            <span aria-hidden="true">←</span> Back
          </button>
          <div className="continue-wrap">
            {step === 5 && escapeReaction && <span className="escape-reaction" aria-live="polite">{escapeReaction}</span>}
            <button
              className={`primary-button continue-button ${step === 5 ? escapeOffset : ""}`}
              type="button"
              onClick={handleContinue}
              disabled={confidentialPending || (step === 10 && values.nicolas_choice !== "King Nicolas")}
            >
              <span>Continue</span><span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {step === REVIEW_STEP && reviewReady && (
        <div className="submit-row review-submit-row">
          <button className="text-button" type="button" onClick={goBack}><span aria-hidden="true">←</span> Review answers</button>
          <button className="primary-button submit-button" type="button" onClick={submitApplication} disabled={isSubmitting}>
            <span>{isSubmitting ? "Submitting" : "Submit application"}</span>
            {isSubmitting ? <span className="spinner" aria-hidden="true" /> : <span aria-hidden="true">↗</span>}
          </button>
        </div>
      )}

      {submitError && <p className="submit-error" role="alert">{submitError} Please try again.</p>}

      {nameModal !== "closed" && (
        <NameConfirmationModal
          firstName={firstName}
          accepted={nameModal === "accepted"}
          onAccept={continueAfterName}
          onFix={() => {
            setNameModal("closed");
            window.setTimeout(() => document.getElementById("first_name")?.focus(), 20);
          }}
        />
      )}

      {restrictedOpen && (
        <RestrictedDataOverlay fast={restrictedFast} onClose={closeRestricted} />
      )}
    </form>
  );
}

function StepHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="step-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

function FormField({
  number,
  label,
  name,
  value,
  error,
  type = "text",
  autoComplete,
  inputMode,
  onChange,
}: {
  number?: string;
  label: string;
  name: FieldName;
  value: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email";
  onChange: (name: FieldName, value: string) => void;
}) {
  const errorId = `${name}-error`;
  const maxLength = name === "email" ? 320 : name === "street_address" ? 200 : name === "zip_code" ? 20 : name === "how_heard_other" ? 72 : 80;
  return (
    <div className="field-block">
      <label className="field-label" htmlFor={name}>
        {number && <span className="field-number">{number}</span>}
        <span>{label}<span className="required-mark"> *</span></span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        required
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(event) => onChange(name, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  );
}

function TextareaField({
  label,
  name,
  value,
  error,
  reaction,
  spacious,
  onChange,
}: {
  label: string;
  name: FieldName;
  value: string;
  error?: string;
  reaction?: string;
  spacious?: boolean;
  onChange: (name: FieldName, value: string) => void;
}) {
  const errorId = `${name}-error`;
  const metaId = `${name}-meta`;
  return (
    <div className={`field-block textarea-block ${spacious ? "is-spacious" : ""}`}>
      <label className="field-label" htmlFor={name}>
        <span>{label}<span className="required-mark"> *</span></span>
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        required
        maxLength={1200}
        rows={spacious ? 8 : 6}
        placeholder="Your answer..."
        onChange={(event) => onChange(name, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : metaId}
      />
      <div className="field-meta" id={metaId}>
        <span className={reaction ? `answer-reaction is-visible ${reaction.startsWith("Okay Shakespeare") ? "is-prominent" : ""}` : "answer-reaction"}>{reaction || "Required"}</span>
        <span>{value.length} / 1200</span>
      </div>
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  );
}

function TrustScale({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const numericValue = Number(value);
  const reaction = !value
    ? ""
    : numericValue <= 3
      ? "At least you're honest."
      : numericValue <= 6
        ? "That's slightly concerning."
        : numericValue <= 9
          ? "We'll keep an eye on you."
          : "Exactly what an untrustworthy person would say.";

  return (
    <fieldset className="trust-scale" id="trustworthiness" tabIndex={-1} aria-describedby={error ? "trustworthiness-error" : "trustworthiness-reaction"}>
      <legend className="sr-only">Choose a trustworthiness value from 1 to 10</legend>
      <div className="trust-numbers">
        {Array.from({ length: 10 }, (_, index) => String(index + 1)).map((number) => (
          <button
            key={number}
            className={value === number ? "trust-number is-selected" : "trust-number"}
            type="button"
            aria-pressed={value === number}
            onClick={() => onChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="trust-labels" aria-hidden="true"><span>Noted</span><span>Very convincing</span></div>
      <p className="trust-reaction" id="trustworthiness-reaction" aria-live="polite">{reaction}</p>
      {error && <p className="field-error" id="trustworthiness-error">{error}</p>}
    </fieldset>
  );
}

function KingNicolas({
  firstName,
  selected,
  reaction,
  onChoose,
}: {
  firstName: string;
  selected: boolean;
  reaction: string;
  onChoose: (choice: "applicant" | "nicolas") => void;
}) {
  return (
    <section className="king-question" aria-labelledby="king-heading">
      <p className="eyebrow">11 — Be honest</p>
      <h3 id="king-heading">Who’s better?</h3>
      <div className="king-options">
        <button type="button" onClick={() => onChoose("applicant")}>{firstName}</button>
        <button className={selected ? "is-selected" : ""} type="button" onClick={() => onChoose("nicolas")}>King Nicolas 😎</button>
      </div>
      <p className="king-reaction" aria-live="polite">{reaction}</p>
    </section>
  );
}

function NameConfirmationModal({
  firstName,
  accepted,
  onAccept,
  onFix,
}: {
  firstName: string;
  accepted: boolean;
  onAccept: () => void;
  onFix: () => void;
}) {
  const normalizedName = firstName.trim().toLocaleLowerCase("en-US");
  const isBianka = normalizedName === "bianka";
  const isNicolas = normalizedName === "nicolas";
  const prompt = isBianka
    ? "Are you sure you want to use that ugly name?"
    : isNicolas
      ? "Owww, what a grandiose name."
      : "Please confirm this is the name you'd like us to use.";

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="name-modal" role="dialog" aria-modal="true" aria-labelledby="name-modal-title">
        <p className="eyebrow">Identity confirmation</p>
        {accepted ? (
          <div className="name-modal-accepted" aria-live="polite">
            <h3>{isBianka ? "Fair enough." : "Name confirmed."}</h3>
            <p>{isBianka ? "We all have problems." : "We'll use it carefully."}</p>
          </div>
        ) : (
          <>
            <h3 id="name-modal-title">{firstName.toUpperCase()}?</h3>
            <p>{prompt}</p>
            <div className="modal-actions">
              <button className="primary-button" type="button" onClick={onAccept}>{isBianka ? "Yes, I have no choice" : "Confirm name"}</button>
              <button className="secondary-button" type="button" onClick={onFix}>Let me fix it</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ConfidentialTransition({ firstName }: { firstName: string }) {
  return (
    <section className="confidential-transition" aria-live="polite" aria-label="Confidential member evaluation">
      <p>Let’s continue, <strong>{firstName}</strong>.<span>The next section matters.</span></p>
      <div className="classification-rule" aria-hidden="true" />
      <div className="confidential-stamp">Confidential</div>
      <h3>Member Evaluation</h3>
      <small>Internal membership assessment</small>
    </section>
  );
}

function RestrictedAccessLink({ denied, onOpen }: { denied: boolean; onOpen: () => void }) {
  return (
    <div className="restricted-entry">
      <button type="button" onClick={onOpen}>
        <span className="restricted-entry-copy">
          <small>Restricted access</small>
          <strong>View restricted data</strong>
        </span>
        <span className="restricted-entry-arrow" aria-hidden="true">↗</span>
      </button>
      {denied && <small>Access request denied</small>}
    </div>
  );
}

const RESTRICTED_SEQUENCE = [
  "Establishing secure session...",
  "Validating applicant credentials...",
  "Cross-referencing authorization registry...",
  "Resolving federal access permissions...",
] as const;

function RestrictedDataOverlay({ fast, onClose }: { fast: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState(() =>
    fast || window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? RESTRICTED_SEQUENCE.length
      : 0,
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    const timers = fast || reducedMotion
      ? []
      : RESTRICTED_SEQUENCE.map((_, index) =>
          window.setTimeout(() => setPhase(index + 1), 520 + index * 540),
        );
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [fast, onClose]);

  const complete = phase >= RESTRICTED_SEQUENCE.length;
  return (
    <div className="restricted-overlay" role="dialog" aria-modal="true" aria-labelledby="restricted-title">
      <button className="restricted-close" type="button" onClick={onClose} aria-label="Close restricted information system">×</button>
      <div className="restricted-shell">
        <header>
          <p>Restricted information system</p>
          <span>Secure gateway // internal use</span>
        </header>
        <div className="restricted-progress" aria-hidden="true"><span style={{ width: `${Math.max(8, (phase / RESTRICTED_SEQUENCE.length) * 100)}%` }} /></div>
        {!complete ? (
          <section className="restricted-processing" aria-live="polite">
            <p>Secure information gateway</p>
            <h2 id="restricted-title">Processing Access Request</h2>
            <ol>
              {RESTRICTED_SEQUENCE.map((status, index) => (
                <li className={index < phase ? "is-complete" : index === phase ? "is-active" : ""} key={status}>
                  <span>{String(index + 1).padStart(2, "0")}</span>{status}
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <section className="restricted-denial" aria-live="polite">
            <p>Status: <strong>Insufficient authorization</strong></p>
            <h2 id="restricted-title">Access Denied</h2>
            <div className="restricted-copy">
              <p>According to applicable United States government access records, your current authorization level does not permit access to this information.</p>
              <dl><div><dt>Required clearance</dt><dd>Level IV</dd></div><div><dt>Request status</dt><dd>Closed</dd></div></dl>
              <small>Fictional interface demonstration. No external records were queried.</small>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function GiraffeDeclaration({
  firstName,
  checked,
  reaction,
  onChange,
}: {
  firstName: string;
  checked: boolean;
  reaction: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <section className="declaration-panel" aria-labelledby="declaration-title">
      <p className="personalized-transition">Still with us, <strong>{firstName}</strong>?<span>Good.</span></p>
      <p className="eyebrow">12 — Declaration</p>
      <h3 id="declaration-title">Final confirmation.</h3>
      <label className="declaration-check" htmlFor="giraffe_declaration">
        <input id="giraffe_declaration" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span aria-hidden="true" />
        <strong>I confirm that I answered honestly and did not Google how to hide a giraffe.</strong>
      </label>
      <p className="declaration-reaction" aria-live="polite">{reaction}</p>
    </section>
  );
}

function ReviewPanel({ firstName, visibleLines, ready }: { firstName: string; visibleLines: number; ready: boolean }) {
  const normalizedName = firstName.trim().toLocaleLowerCase("en-US");
  const nameResult = normalizedName === "bianka"
    ? "unfortunate"
    : normalizedName === "nicolas"
      ? "exceptional"
      : "verified";
  const reviewLines = REVIEW_LINES.map(([label, result]) =>
    label === "Checking name quality" ? [label, nameResult] as const : [label, result] as const,
  );
  return (
    <section className="review-panel" aria-labelledby="review-heading">
      <p className="eyebrow">Final review</p>
      <h3 id="review-heading">{ready ? "Application ready." : "Reviewing application..."}</h3>
      <p className="review-disclaimer">A brief ceremonial review. No artificial intelligence, judgment, or acceptance decision is involved.</p>
      <div className="review-lines" aria-live="polite">
        {reviewLines.map(([label, result], index) => (
          <div className={index < visibleLines ? "review-line is-visible" : "review-line"} key={label}>
            <span>{label}</span><i aria-hidden="true" /><strong>{result}</strong>
          </div>
        ))}
      </div>
      <p className={ready ? "review-final is-visible" : "review-final"}>Finalizing complete.</p>
    </section>
  );
}

function answerReaction(value: string) {
  const clean = value.trim();
  if (!clean) return "";
  const words = clean.split(/\s+/).length;
  if (clean.length < 24) return "Wow. Really poured your heart into that one.";
  if (words >= 35) return "Okay Shakespeare, that's enough.";
  return "";
}

function giraffeReaction(value: string) {
  const length = value.trim().length;
  if (!length) return "";
  return length < 100
    ? "The giraffe is definitely getting caught."
    : "You've thought about this before, haven't you?";
}

function SuccessScreen({ onReturn }: { onReturn: () => void }) {
  return (
    <section className="success-screen" aria-labelledby="success-title">
      <div className="success-orbit" aria-hidden="true"><span /></div>
      <div className="success-content">
        <p className="eyebrow">Submission confirmed</p>
        <div className="success-mark" aria-hidden="true">✓</div>
        <h1 id="success-title">Application<span>Submitted</span></h1>
        <p>
          Thank you for your application.<br />
          Your responses have been received successfully.<br />
          We’ll contact you using the email provided if there are any updates.
        </p>
        <button className="primary-button" type="button" onClick={onReturn}>
          <span>Return home</span><span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className="success-footer">Private Membership · 2026</p>
    </section>
  );
}
