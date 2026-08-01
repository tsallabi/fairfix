import Link from "next/link";
import type { Metadata } from "next";
import { JobPostForm } from "@/components/JobPostForm";
import { ThemeToggle } from "@/components/ThemeToggle";

// This page reads searchParams (the estimate → job handoff), which makes it
// dynamic — it must run on the edge for @cloudflare/next-on-pages.
export const runtime = "edge";

export const metadata: Metadata = {
  title: "Post a job · Verified tradesmen come to you",
  description:
    "Tell us the job once and verified Irish tradesmen come to you with fair offers. Free while FairFix is in early access.",
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function firstInt(value: string | string[] | undefined): number | undefined {
  const raw = first(value);
  if (!raw) return undefined;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export default function NewJobPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const service = first(searchParams.service);
  const description = first(searchParams.description);
  const budget = firstInt(searchParams.budget);
  const eircode = first(searchParams.eircode)?.slice(0, 8);

  const min = firstInt(searchParams.min);
  const max = firstInt(searchParams.max);
  const confidence = first(searchParams.confidence);
  const source = first(searchParams.source);
  const estimate =
    typeof min === "number" &&
    typeof max === "number" &&
    max >= min &&
    confidence &&
    source
      ? { min, max, confidence, source }
      : undefined;

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
          — Post a job · Free while in early access
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
          Tell us the job. Tradesmen come to you.
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
          Describe it once, and RECI, RGII and Safe-Pass verified tradesmen
          make you fair offers — no ringing around, no guessing what it should
          cost.
        </p>

        <JobPostForm
          defaultService={service}
          defaultDescription={description}
          defaultBudget={budget}
          defaultEircode={eircode}
          estimate={estimate}
        />
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
