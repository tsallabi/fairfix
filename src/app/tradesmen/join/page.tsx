import Link from "next/link";
import type { Metadata } from "next";
import { TradesmanForm } from "@/components/TradesmanForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Join as a tradesman",
  description:
    "Register your trade on FairFix.ie — no lead fees, no bidding wars. RECI, RGII and Safe Pass verified. Keep 100% of your first month.",
};

const stats: { value: string; label: string }[] = [
  { value: "€0", label: "PER LEAD" },
  { value: "48h", label: "VERIFICATION" },
  { value: "100%", label: "OF MONTH ONE" },
];

export default function TradesmanJoinPage() {
  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "color-mix(in srgb, var(--paper) 90%, transparent)",
          backdropFilter: "saturate(1.6) blur(10px)",
          WebkitBackdropFilter: "saturate(1.6) blur(10px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: "inherit",
            }}
            aria-label="FairFix.ie home"
          >
            <span className="brand-mark" aria-hidden="true" />
            <span
              className="serif"
              style={{ fontSize: "20px", letterSpacing: "-0.01em" }}
            >
              FairFix.ie
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "60px 24px 100px",
        }}
      >
        <div className="kicker" style={{ marginBottom: "20px" }}>
          — For Irish tradesmen · Free while in early access
        </div>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(40px, 5.4vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.028em",
            margin: "0 0 20px",
            textWrap: "balance",
            fontWeight: 400,
          }}
        >
          No lead fees. No bidding wars. Just{" "}
          <em style={{ color: "var(--brand-1)", fontStyle: "italic" }}>work</em>.
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "var(--ink-2)",
            lineHeight: 1.55,
            margin: "0 0 44px",
            maxWidth: "540px",
          }}
        >
          FairFix is a flat subscription, not pay-per-lead — and you keep 100%
          of what you earn in your first month. Every job arrives with a fair
          AI price range already attached, so you spend your time on real work,
          not haggling with tyre-kickers.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            background: "var(--paper-2)",
            margin: "0 0 56px",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "22px 12px",
                textAlign: "center",
                borderLeft: i === 0 ? "none" : "1px solid var(--line)",
              }}
            >
              <div
                className="serif"
                style={{
                  fontSize: "clamp(22px, 3.4vw, 32px)",
                  color: "var(--ink)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                className="mono"
                style={{
                  marginTop: "6px",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  color: "var(--ink-3)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <TradesmanForm />
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "24px 24px",
          background: "var(--paper-2)",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
          className="mono"
        >
          <span
            style={{
              fontSize: "11px",
              color: "var(--ink-3)",
              letterSpacing: "0.08em",
            }}
          >
            © 2026 FAIRFIX.IE · DUBLIN
          </span>
          <Link
            href="/"
            style={{
              fontSize: "11px",
              color: "var(--ink-3)",
              letterSpacing: "0.08em",
              textDecoration: "none",
            }}
          >
            ← BACK HOME
          </Link>
        </div>
      </footer>
    </>
  );
}
