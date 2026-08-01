"use client";

import { useState, type FormEvent } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; email: string }
  | { kind: "error"; message: string };

export function WaitlistForm({
  audience = "homeowner",
}: {
  audience?: "homeowner" | "tradesman";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus({ kind: "error", message: "Please enter a valid email." });
      return;
    }
    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, audience }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setStatus({
          kind: "error",
          message: data.error ?? "Something went wrong. Try again.",
        });
        return;
      }

      setStatus({ kind: "success", email });
      setEmail("");
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
        className="serif"
        style={{
          padding: "20px 24px",
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))",
          border: "1.5px solid var(--brand-2)",
          borderRadius: "16px",
          maxWidth: "480px",
        }}
        role="status"
        aria-live="polite"
      >
        <div
          style={{ fontSize: "22px", color: "var(--ink)", lineHeight: 1.15 }}
        >
          You&rsquo;re on the list.
        </div>
        <div
          style={{
            marginTop: "6px",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: "13px",
            color: "var(--ink-2)",
            lineHeight: 1.5,
          }}
        >
          We&rsquo;ll email {status.email} the moment FairFix opens in your
          area. No spam, no forwarding your address anywhere. Ever.
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        gap: "8px",
        maxWidth: "480px",
        flexWrap: "wrap",
      }}
    >
      <label
        htmlFor="waitlist-email"
        style={{ position: "absolute", left: "-9999px" }}
      >
        Email address
      </label>
      <input
        id="waitlist-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.ie"
        autoComplete="email"
        disabled={status.kind === "submitting"}
        style={{
          flex: "1 1 240px",
          minWidth: 0,
          padding: "14px 18px",
          borderRadius: "999px",
          border: "1px solid var(--line)",
          background: "var(--paper)",
          color: "var(--ink)",
          fontSize: "15px",
          fontFamily: "inherit",
          outline: "none",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "var(--brand-2)")
        }
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
      />
      <button
        type="submit"
        disabled={status.kind === "submitting"}
        style={{
          padding: "14px 22px",
          borderRadius: "999px",
          border: 0,
          background:
            "linear-gradient(135deg, var(--navy-2), var(--navy-1))",
          color: "var(--paper)",
          fontSize: "15px",
          fontWeight: 600,
          cursor:
            status.kind === "submitting" ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: status.kind === "submitting" ? 0.7 : 1,
          transition: "transform 0.15s ease",
          whiteSpace: "nowrap",
        }}
        onMouseDown={(e) =>
          (e.currentTarget.style.transform = "scale(0.98)")
        }
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {status.kind === "submitting" ? "Adding you…" : "Get early access"}
      </button>

      {status.kind === "error" && (
        <div
          role="alert"
          className="mono"
          style={{
            fontSize: "11px",
            color: "var(--coral)",
            letterSpacing: "0.06em",
            width: "100%",
            marginTop: "4px",
          }}
        >
          {status.message}
        </div>
      )}
    </form>
  );
}
