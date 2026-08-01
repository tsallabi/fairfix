import Link from "next/link";
import type { Metadata } from "next";
import { EstimateWizard } from "@/components/EstimateWizard";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Try the AI · Fair-price estimate in 30 seconds",
  description:
    "Describe your home-services job and get a fair Irish market price range from the FairFix AI. No sign-up. No commitment.",
};

export default function EstimatePage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes estimate-spin { to { transform: rotate(360deg); } }
            @media (prefers-reduced-motion) {
              @keyframes estimate-spin { to { transform: rotate(0deg); } }
            }
          `,
        }}
      />
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
          — Public tool · No sign-up
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
          Get a <em style={{ color: "var(--brand-1)", fontStyle: "italic" }}>fair</em>{" "}
          price for your job.
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
          Pick the trade, describe the job in a sentence, and our AI shows you
          the typical Irish range — with a confidence score. It never diagnoses
          the fault, so you can trust the number.
        </p>

        <EstimateWizard />
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
