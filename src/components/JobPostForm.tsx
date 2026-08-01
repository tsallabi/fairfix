"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { services } from "@/lib/services";

type EstimateSummary = {
  min: number;
  max: number;
  confidence: string;
  source: string;
};

type Props = {
  defaultService?: string;
  defaultDescription?: string;
  defaultBudget?: number;
  defaultEircode?: string;
  estimate?: EstimateSummary;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; jobId: string }
  | { kind: "error"; message: string };

const labelStyle: CSSProperties = {
  fontSize: "10px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  display: "block",
  marginBottom: "8px",
  fontWeight: 600,
};

const fieldStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid var(--line)",
  background: "var(--paper)",
  color: "var(--ink)",
  fontSize: "15px",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

export function JobPostForm({
  defaultService,
  defaultDescription,
  defaultBudget,
  defaultEircode,
  estimate,
}: Props) {
  const [email, setEmail] = useState("");
  const [service, setService] = useState(
    services.some((s) => s.slug === defaultService)
      ? (defaultService as string)
      : services[0].slug
  );
  const [description, setDescription] = useState(defaultDescription ?? "");
  const [budget, setBudget] = useState(
    typeof defaultBudget === "number" && defaultBudget >= 0
      ? String(Math.round(defaultBudget))
      : ""
  );
  const [eircode, setEircode] = useState(defaultEircode ?? "");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus({ kind: "error", message: "Please enter a valid email." });
      return;
    }
    if (description.trim().length < 10) {
      setStatus({
        kind: "error",
        message: "Describe the job in a sentence or two.",
      });
      return;
    }
    setStatus({ kind: "submitting" });

    const budgetNumber = budget.trim() === "" ? undefined : Number(budget);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          service,
          description,
          budget:
            typeof budgetNumber === "number" &&
            Number.isFinite(budgetNumber) &&
            budgetNumber >= 0
              ? Math.round(budgetNumber)
              : undefined,
          eircode: eircode.trim() || undefined,
          estimate,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };

      if (!res.ok || !data.ok || !data.id) {
        setStatus({
          kind: "error",
          message: data.error ?? "Something went wrong. Try again.",
        });
        return;
      }

      setStatus({ kind: "success", jobId: data.id });
    } catch {
      setStatus({
        kind: "error",
        message: "Network trouble. Try again in a moment.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        style={{
          padding: "24px 28px",
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))",
          border: "1.5px solid var(--brand-2)",
          borderRadius: "16px",
          maxWidth: "560px",
        }}
        role="status"
        aria-live="polite"
      >
        <div
          className="serif"
          style={{
            fontSize: "26px",
            color: "var(--ink)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          Job posted.
        </div>
        <div
          style={{
            marginTop: "8px",
            fontSize: "13px",
            color: "var(--ink-2)",
            lineHeight: 1.55,
          }}
        >
          Verified tradesmen will be in touch the moment FairFix opens in your
          area. We&rsquo;ll only use your email for this job — no spam, no
          forwarding your address anywhere. Ever.
        </div>
        <div
          className="mono"
          style={{
            marginTop: "14px",
            fontSize: "11px",
            color: "var(--ink-3)",
            letterSpacing: "0.06em",
          }}
        >
          REF · {status.jobId}
        </div>
      </div>
    );
  }

  const isSubmitting = status.kind === "submitting";

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: "560px" }}>
      {estimate && (
        <div
          className="mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "999px",
            border: "1.5px solid var(--brand-2)",
            color: "var(--brand-1)",
            fontSize: "12px",
            letterSpacing: "0.06em",
            marginBottom: "24px",
          }}
        >
          AI estimate: €{estimate.min}–€{estimate.max}
        </div>
      )}

      <label style={{ display: "block", marginBottom: "20px" }}>
        <span className="mono" style={labelStyle}>
          Your email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.ie"
          autoComplete="email"
          disabled={isSubmitting}
          style={fieldStyle}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--brand-2)")
          }
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
        />
      </label>

      <label style={{ display: "block", marginBottom: "20px" }}>
        <span className="mono" style={labelStyle}>
          Trade
        </span>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          disabled={isSubmitting}
          style={{ ...fieldStyle, cursor: "pointer", appearance: "none" }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--brand-2)")
          }
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
        >
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "block", marginBottom: "20px" }}>
        <span className="mono" style={labelStyle}>
          The job
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Two kitchen sockets stopped working after the kettle tripped the fuse. Board reset, still dead."
          rows={4}
          required
          maxLength={2000}
          disabled={isSubmitting}
          style={{
            ...fieldStyle,
            padding: "16px",
            lineHeight: 1.55,
            resize: "vertical",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--brand-2)")
          }
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
        />
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <label>
          <span className="mono" style={labelStyle}>
            Budget in € (optional)
          </span>
          <input
            type="number"
            min={0}
            step={10}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="150"
            disabled={isSubmitting}
            style={fieldStyle}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--brand-2)")
            }
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          />
        </label>

        <label>
          <span className="mono" style={labelStyle}>
            Eircode (optional)
          </span>
          <input
            type="text"
            value={eircode}
            onChange={(e) => setEircode(e.target.value.toUpperCase())}
            placeholder="D02 XY45"
            maxLength={8}
            autoComplete="postal-code"
            disabled={isSubmitting}
            style={{ ...fieldStyle, letterSpacing: "0.04em" }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--brand-2)")
            }
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          />
        </label>
      </div>

      {status.kind === "error" && (
        <div
          role="alert"
          className="mono"
          style={{
            fontSize: "12px",
            color: "var(--coral)",
            letterSpacing: "0.04em",
            marginBottom: "16px",
          }}
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "16px 28px",
          borderRadius: "999px",
          border: 0,
          background: "linear-gradient(135deg, var(--navy-2), var(--navy-1))",
          color: "var(--paper)",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
          transition: "transform 0.15s ease",
          whiteSpace: "nowrap",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isSubmitting ? "Posting the job…" : "Post the job →"}
      </button>
      <p
        className="mono"
        style={{
          marginTop: "12px",
          fontSize: "10px",
          color: "var(--ink-3)",
          letterSpacing: "0.06em",
        }}
      >
        FREE WHILE IN EARLY ACCESS · YOUR EMAIL IS NEVER SHARED
      </p>
    </form>
  );
}
