import { SiteNav } from "@/components/SiteNav";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <AiFeature />
        <TradesmanCta />
        <Faq />
        <Footer />
      </main>
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  HERO                                                        */
/* ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        padding: "80px 24px 60px",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-160px",
          right: "-120px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--brand-3) 0%, transparent 60%)",
          filter: "blur(80px)",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--coral) 0%, transparent 60%)",
          filter: "blur(80px)",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <div
          className="kicker"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              width: "40px",
              height: "1px",
              background: "var(--ink)",
              display: "inline-block",
            }}
          />
          Now inviting Dublin homeowners
        </div>

        <h1
          className="serif"
          style={{
            fontSize: "clamp(44px, 6vw, 82px)",
            lineHeight: 1.02,
            letterSpacing: "-0.028em",
            margin: 0,
            fontWeight: 400,
            textWrap: "balance",
            maxWidth: "18ch",
          }}
        >
          A fair price. A real tradesman.{" "}
          <em style={{ color: "var(--brand-1)" }}>Before</em> anyone sells you
          anything.
        </h1>

        <p
          style={{
            marginTop: "28px",
            fontSize: "19px",
            lineHeight: 1.55,
            color: "var(--ink-2)",
            maxWidth: "540px",
          }}
        >
          Describe your job. Our AI shows you the range 340 similar jobs settled
          at — with a confidence score. Then you pick from RECI-verified Irish
          tradesmen who bid on the work.
        </p>

        <div style={{ marginTop: "36px" }}>
          <div
            className="kicker"
            style={{ marginBottom: "10px", color: "var(--brand-1)" }}
          >
            Get on the waitlist
          </div>
          <WaitlistForm audience="homeowner" />
          <p
            className="mono"
            style={{
              marginTop: "12px",
              fontSize: "11px",
              color: "var(--ink-3)",
              letterSpacing: "0.04em",
            }}
          >
            No spam. One email when we open in your area.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  TRUST BAR                                                   */
/* ─────────────────────────────────────────────────────────── */

function TrustBar() {
  const items = [
    { n: "2,500+", u: "", t: "RECI VERIFIED" },
    { n: "4.9", u: "★", t: "GOOGLE RATING" },
    { n: "€2", u: "M", t: "PUBLIC LIABILITY" },
    { n: "26", u: "", t: "IRISH COUNTIES" },
  ];
  return (
    <section
      style={{
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        padding: "24px 24px",
        background: "var(--paper-2)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
        }}
      >
        {items.map((it) => (
          <div key={it.t} style={{ textAlign: "center" }}>
            <div
              className="serif"
              style={{
                fontSize: "28px",
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                display: "inline-flex",
                alignItems: "baseline",
                gap: "3px",
              }}
            >
              {it.n}
              {it.u && (
                <span
                  className="mono"
                  style={{
                    fontSize: "13px",
                    color: "var(--brand-1)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {it.u}
                </span>
              )}
            </div>
            <div
              className="mono"
              style={{
                fontSize: "10px",
                color: "var(--ink-3)",
                letterSpacing: "0.14em",
                marginTop: "4px",
              }}
            >
              {it.t}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  HOW IT WORKS                                                */
/* ─────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Describe your job",
      body: "Two photos, a sentence in plain English. “The kettle tripped the fuse and two sockets went dead.” That&rsquo;s enough.",
      accent: "#2A4A7F",
    },
    {
      n: "02",
      title: "See the fair price",
      body: "Our AI checks 340 similar jobs in Dublin and shows you a range with a confidence score. No sales pitch, just a number.",
      accent: "#0B7F58",
    },
    {
      n: "03",
      title: "Choose your tradesman",
      body: "Three RECI-verified tradesmen respond within minutes. Pick one. €15 inspection fee is held in escrow until they arrive.",
      accent: "#C88A2A",
    },
  ];
  return (
    <section
      id="how"
      style={{
        padding: "80px 24px 40px",
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div className="kicker" style={{ marginBottom: "12px" }}>
          How it works
        </div>
        <h2
          className="serif"
          style={{
            fontSize: "clamp(36px, 4vw, 52px)",
            letterSpacing: "-0.02em",
            fontWeight: 400,
            margin: "0 0 12px",
            textWrap: "balance",
          }}
        >
          Three taps. One fair price.
        </h2>
        <p
          style={{
            color: "var(--ink-2)",
            fontSize: "17px",
            margin: "0 0 48px",
            maxWidth: "560px",
          }}
        >
          The whole flow, from opening the app to booking a verified
          tradesman, in about two minutes.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {steps.map((s) => (
            <article
              key={s.n}
              style={{
                borderTop: `2px solid ${s.accent}`,
                paddingTop: "20px",
              }}
            >
              <div
                className="serif"
                style={{
                  fontSize: "40px",
                  letterSpacing: "-0.03em",
                  color: "var(--ink-3)",
                  lineHeight: 1,
                  marginBottom: "12px",
                }}
              >
                {s.n}
              </div>
              <h3
                className="serif"
                style={{
                  fontSize: "24px",
                  fontWeight: 400,
                  letterSpacing: "-0.015em",
                  margin: "0 0 10px",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  color: "var(--ink-2)",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  margin: 0,
                }}
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  AI FEATURE (dark section)                                   */
/* ─────────────────────────────────────────────────────────── */

function AiFeature() {
  return (
    <section
      style={{
        margin: "60px 0",
        background: "linear-gradient(135deg, #0B1F33 0%, #14314D 100%)",
        color: "#F5EFDF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "80px 24px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "48px",
        }}
      >
        <div>
          <div
            className="mono"
            style={{
              fontSize: "11px",
              letterSpacing: "0.14em",
              color: "#34D399",
              marginBottom: "12px",
            }}
          >
            ✦ AI PRICE ESTIMATE
          </div>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(32px, 4.4vw, 54px)",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              margin: "0 0 20px",
              textWrap: "balance",
              maxWidth: "22ch",
              lineHeight: 1.05,
            }}
          >
            The number you actually want, before anyone tries to sell you
            anything.
          </h2>
          <p
            style={{
              color: "rgba(245,239,223,0.75)",
              fontSize: "17px",
              lineHeight: 1.6,
              margin: "0 0 32px",
              maxWidth: "520px",
            }}
          >
            The AI never diagnoses the fault. It shows you the range similar
            jobs settled at, with a confidence score and sample size. Non-
            promissory, verifiable, fair.
          </p>

          <EstimateCard />
        </div>
      </div>
    </section>
  );
}

function EstimateCard() {
  return (
    <div
      style={{
        padding: "24px 26px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(52, 211, 153, 0.3)",
        borderRadius: "20px",
        maxWidth: "440px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "140px",
          height: "140px",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          position: "relative",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: "10px",
            letterSpacing: "0.14em",
            color: "#34D399",
          }}
        >
          ✦ AI ESTIMATE
        </span>
        <span
          className="mono"
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          CONFIDENCE 82%
        </span>
      </div>
      <div
        className="serif"
        style={{
          fontSize: "52px",
          letterSpacing: "-0.03em",
          margin: "12px 0 4px",
          lineHeight: 1,
          position: "relative",
        }}
      >
        €90
        <span
          style={{
            color: "rgba(255,255,255,0.4)",
            margin: "0 12px",
            fontSize: "40px",
          }}
        >
          –
        </span>
        €160
      </div>
      <p
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.5,
          margin: "0 0 16px",
          position: "relative",
        }}
      >
        Based on 340 similar jobs completed in Dublin.
      </p>
      <div
        style={{
          height: "8px",
          borderRadius: "4px",
          background: "rgba(255,255,255,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "15%",
            right: "25%",
            background:
              "linear-gradient(90deg, var(--brand-2), var(--brand-3))",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-2px",
            bottom: "-2px",
            left: "42%",
            width: "3px",
            background: "white",
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  TRADESMAN CTA                                               */
/* ─────────────────────────────────────────────────────────── */

function TradesmanCta() {
  return (
    <section
      id="tradesmen"
      style={{ padding: "80px 24px" }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "48px 40px",
          borderRadius: "24px",
          border: "1px solid var(--line)",
          background: "var(--paper-2)",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "32px",
          alignItems: "center",
        }}
      >
        <div>
          <div className="kicker" style={{ marginBottom: "10px" }}>
            For Irish tradesmen
          </div>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(28px, 3.4vw, 42px)",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              margin: "0 0 16px",
              textWrap: "balance",
              maxWidth: "22ch",
              lineHeight: 1.08,
            }}
          >
            Deserve better than pay-per-lead.
          </h2>
          <p
            style={{
              color: "var(--ink-2)",
              fontSize: "16px",
              lineHeight: 1.6,
              margin: "0 0 24px",
              maxWidth: "540px",
            }}
          >
            No lead credits. No bidding wars. No paying for jobs you don&rsquo;t
            get. Straight subscription, and you keep 100% of the first month.
          </p>

          <div
            style={{
              display: "flex",
              gap: "8px",
              maxWidth: "480px",
              flexWrap: "wrap",
            }}
          >
            <WaitlistForm audience="tradesman" />
          </div>

          <p
            className="mono"
            style={{
              marginTop: "12px",
              fontSize: "11px",
              color: "var(--ink-3)",
              letterSpacing: "0.04em",
            }}
          >
            RECI, RGII, Safe Pass, and public-liability verification required.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  FAQ                                                         */
/* ─────────────────────────────────────────────────────────── */

const faqs: { q: string; a: string }[] = [
  {
    q: "What if the actual price is different from the AI estimate?",
    a: "The AI gives you a range, not a promise. If the tradesman finds the job is bigger once they arrive, they submit a revision with photos and a new price. You approve it, decline (walk away for the €15 inspection fee only), or send a counter-offer. Nothing changes without your say-so.",
  },
  {
    q: "How do I know a tradesman is qualified?",
    a: "Every tradesman on FairFix is RECI, RGII, or Safe Pass verified for the work they do, with a valid €2M public liability policy on file. You see their real credentials in-app before you book — not a badge we invented.",
  },
  {
    q: "What happens if the tradesman doesn't show up?",
    a: "The €15 inspection fee is held in escrow. It only releases to them when they arrive. If they don't, you get it back automatically, no forms.",
  },
  {
    q: "How does the €15 inspection fee work?",
    a: "It's a small fee you pay when you confirm the booking. It compensates the tradesman for showing up and inspecting. If you go ahead with the job, it stays with them. If you decline after the inspection, it stays with them — you paid for a call-out. If they never turn up, you get it back.",
  },
  {
    q: "Which counties do you cover?",
    a: "We're opening in Dublin first (D01–D24), then Cork, Galway, Limerick, and Waterford. Join the waitlist and we'll email you the moment we open in yours.",
  },
  {
    q: "How much do tradesmen pay to use FairFix?",
    a: "A flat monthly subscription — no credits, no bidding, no per-lead fees. The first month is free. After that, tiers start at €0 (free listing, reactive matching) and go up to €99/month (top placement, early access to leads).",
  },
];

function Faq() {
  return (
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <div className="kicker" style={{ marginBottom: "12px" }}>
          Common questions
        </div>
        <h2
          className="serif"
          style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            letterSpacing: "-0.02em",
            fontWeight: 400,
            margin: "0 0 40px",
            textWrap: "balance",
          }}
        >
          Everything else, briefly.
        </h2>
        <div>
          {faqs.map((f) => (
            <details
              key={f.q}
              style={{
                borderTop: "1px solid var(--line)",
                padding: "20px 0",
              }}
            >
              <summary
                className="serif"
                style={{
                  fontSize: "19px",
                  letterSpacing: "-0.005em",
                  cursor: "pointer",
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                  color: "var(--ink)",
                }}
              >
                <span>{f.q}</span>
                <span
                  aria-hidden="true"
                  className="mono"
                  style={{
                    color: "var(--brand-1)",
                    fontSize: "24px",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </summary>
              <p
                style={{
                  marginTop: "12px",
                  color: "var(--ink-2)",
                  fontSize: "15px",
                  lineHeight: 1.6,
                }}
              >
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  FOOTER                                                      */
/* ─────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        padding: "60px 24px 32px",
        background: "var(--paper-2)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <span className="brand-mark" aria-hidden="true" />
            <span className="serif" style={{ fontSize: "18px" }}>
              FairFix.ie
            </span>
          </div>
          <p
            style={{
              color: "var(--ink-2)",
              fontSize: "13px",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "260px",
            }}
          >
            Made in Dublin. Built for Ireland. GDPR-compliant, data hosted in
            the EU.
          </p>
        </div>

        <FooterCol title="Company">
          <FooterLink href="#how">How it works</FooterLink>
          <FooterLink href="#tradesmen">For tradesmen</FooterLink>
          <FooterLink href="/demos/gallery.html">Design gallery</FooterLink>
        </FooterCol>

        <FooterCol title="Legal">
          <FooterLink href="/privacy">Privacy policy</FooterLink>
          <FooterLink href="/terms">Terms of service</FooterLink>
          <FooterLink href="/cookies">Cookie policy</FooterLink>
        </FooterCol>

        <FooterCol title="Support">
          <FooterLink href="mailto:hello@fairfix.ie">
            hello@fairfix.ie
          </FooterLink>
        </FooterCol>
      </div>

      <div
        style={{
          maxWidth: "1180px",
          margin: "40px auto 0",
          paddingTop: "24px",
          borderTop: "1px solid var(--line)",
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
        <span
          style={{
            fontSize: "11px",
            color: "var(--ink-3)",
            letterSpacing: "0.08em",
          }}
        >
          ENGLISH · GAEILGE
        </span>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="kicker" style={{ marginBottom: "16px" }}>
        {title}
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {children}
      </ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        style={{
          color: "var(--ink-2)",
          fontSize: "14px",
          textDecoration: "none",
        }}
      >
        {children}
      </a>
    </li>
  );
}
