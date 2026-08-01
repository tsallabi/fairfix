"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { services } from "@/lib/services";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; id: string }
  | { kind: "error"; message: string };

type Fields = {
  fullName: string;
  email: string;
  trade: string;
  serviceArea: string;
  reciNumber: string;
  rgiiNumber: string;
  safePassNumber: string;
  publicLiability: string;
};

const emptyFields: Fields = {
  fullName: "",
  email: "",
  trade: "",
  serviceArea: "",
  reciNumber: "",
  rgiiNumber: "",
  safePassNumber: "",
  publicLiability: "",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 16px",
  borderRadius: "12px",
  border: "1px solid var(--line)",
  background: "var(--paper)",
  color: "var(--ink)",
  fontSize: "15px",
  fontFamily: "inherit",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--ink-2)",
  marginBottom: "6px",
};

type Focusable = { currentTarget: { style: CSSStyleDeclaration } };

function focusRing(e: Focusable) {
  e.currentTarget.style.borderColor = "var(--brand-2)";
}
function blurRing(e: Focusable) {
  e.currentTarget.style.borderColor = "var(--line)";
}

export function TradesmanForm() {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function set<K extends keyof Fields>(key: K) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fields.email.includes("@")) {
      setStatus({ kind: "error", message: "Please enter a valid email." });
      return;
    }
    if (!fields.trade) {
      setStatus({ kind: "error", message: "Pick your trade from the list." });
      return;
    }
    if (
      !fields.reciNumber.trim() &&
      !fields.rgiiNumber.trim() &&
      !fields.safePassNumber.trim()
    ) {
      setStatus({
        kind: "error",
        message:
          "At least one credential (RECI, RGII or Safe Pass) is required.",
      });
      return;
    }
    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/tradesmen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.email,
          fullName: fields.fullName,
          trade: fields.trade,
          serviceArea: fields.serviceArea,
          reciNumber: fields.reciNumber || undefined,
          rgiiNumber: fields.rgiiNumber || undefined,
          safePassNumber: fields.safePassNumber || undefined,
          publicLiability: fields.publicLiability || undefined,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? "Something went wrong. Try again.",
        });
        return;
      }

      setStatus({ kind: "success", id: data.id ?? "" });
      setFields(emptyFields);
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
          style={{ fontSize: "24px", color: "var(--ink)", lineHeight: 1.15 }}
        >
          Application received.
        </div>
        <div
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "var(--ink-2)",
            lineHeight: 1.55,
          }}
        >
          We verify every credential by hand — RECI and RGII registers, Safe
          Pass records, and your insurance cert. Expect an email within 48
          hours.
        </div>
        {status.id && (
          <div
            className="mono"
            style={{
              marginTop: "14px",
              fontSize: "11px",
              color: "var(--ink-3)",
              letterSpacing: "0.08em",
            }}
          >
            APPLICATION REF · {status.id}
          </div>
        )}
      </div>
    );
  }

  const busy = status.kind === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "36px",
        maxWidth: "560px",
      }}
    >
      {/* ─── About you ─── */}
      <section>
        <div className="kicker" style={{ marginBottom: "16px" }}>
          About you
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="tm-fullname" style={labelStyle}>
              Full name
            </label>
            <input
              id="tm-fullname"
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={fields.fullName}
              onChange={set("fullName")}
              autoComplete="name"
              disabled={busy}
              style={inputStyle}
              onFocus={focusRing}
              onBlur={blurRing}
            />
          </div>
          <div>
            <label htmlFor="tm-email" style={labelStyle}>
              Email address
            </label>
            <input
              id="tm-email"
              type="email"
              required
              value={fields.email}
              onChange={set("email")}
              placeholder="your@email.ie"
              autoComplete="email"
              disabled={busy}
              style={inputStyle}
              onFocus={focusRing}
              onBlur={blurRing}
            />
          </div>
        </div>
      </section>

      {/* ─── Your trade ─── */}
      <section>
        <div className="kicker" style={{ marginBottom: "16px" }}>
          Your trade
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="tm-trade" style={labelStyle}>
              Trade
            </label>
            <select
              id="tm-trade"
              required
              value={fields.trade}
              onChange={set("trade")}
              disabled={busy}
              style={{
                ...inputStyle,
                appearance: "none",
                WebkitAppearance: "none",
                cursor: "pointer",
              }}
              onFocus={focusRing}
              onBlur={blurRing}
            >
              <option value="" disabled>
                Pick your trade…
              </option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tm-area" style={labelStyle}>
              Service area
            </label>
            <input
              id="tm-area"
              type="text"
              required
              minLength={2}
              maxLength={120}
              value={fields.serviceArea}
              onChange={set("serviceArea")}
              placeholder="e.g. Dublin 2–8 · D01–D08"
              disabled={busy}
              style={inputStyle}
              onFocus={focusRing}
              onBlur={blurRing}
            />
          </div>
        </div>
      </section>

      {/* ─── Credentials ─── */}
      <section>
        <div className="kicker" style={{ marginBottom: "8px" }}>
          Credentials
        </div>
        <div
          className="mono"
          style={{
            fontSize: "11px",
            color: "var(--ink-3)",
            letterSpacing: "0.08em",
            marginBottom: "16px",
          }}
        >
          AT LEAST ONE REQUIRED · VERIFIED BEFORE YOU GO LIVE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="tm-reci" style={labelStyle}>
              RECI registration number
            </label>
            <input
              id="tm-reci"
              type="text"
              maxLength={60}
              value={fields.reciNumber}
              onChange={set("reciNumber")}
              disabled={busy}
              style={inputStyle}
              onFocus={focusRing}
              onBlur={blurRing}
            />
          </div>
          <div>
            <label htmlFor="tm-rgii" style={labelStyle}>
              RGII registration number
            </label>
            <input
              id="tm-rgii"
              type="text"
              maxLength={60}
              value={fields.rgiiNumber}
              onChange={set("rgiiNumber")}
              disabled={busy}
              style={inputStyle}
              onFocus={focusRing}
              onBlur={blurRing}
            />
          </div>
          <div>
            <label htmlFor="tm-safepass" style={labelStyle}>
              Safe Pass number
            </label>
            <input
              id="tm-safepass"
              type="text"
              maxLength={60}
              value={fields.safePassNumber}
              onChange={set("safePassNumber")}
              disabled={busy}
              style={inputStyle}
              onFocus={focusRing}
              onBlur={blurRing}
            />
          </div>
          <div>
            <label htmlFor="tm-liability" style={labelStyle}>
              Public liability policy no.
            </label>
            <input
              id="tm-liability"
              type="text"
              maxLength={60}
              value={fields.publicLiability}
              onChange={set("publicLiability")}
              disabled={busy}
              style={inputStyle}
              onFocus={focusRing}
              onBlur={blurRing}
            />
          </div>
        </div>
      </section>

      <div>
        <button
          type="submit"
          disabled={busy}
          style={{
            padding: "15px 28px",
            borderRadius: "999px",
            border: 0,
            background: "linear-gradient(135deg, var(--navy-2), var(--navy-1))",
            color: "var(--paper)",
            fontSize: "15px",
            fontWeight: 600,
            cursor: busy ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: busy ? 0.7 : 1,
            transition: "transform 0.15s ease",
            whiteSpace: "nowrap",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {busy ? "Sending your application…" : "Apply to join FairFix"}
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
              marginTop: "12px",
            }}
          >
            {status.message}
          </div>
        )}
      </div>
    </form>
  );
}
