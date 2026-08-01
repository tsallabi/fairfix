/**
 * Transactional email templates for FairFix.ie.
 *
 * Each template returns { subject, html, text } ready to spread into
 * sendEmail / sendEmailSafe from @/lib/email.
 *
 * HTML is email-safe: table layout, inline styles only, no webfonts, no
 * images, no external resources. Palette mirrors globals.css design
 * tokens (paper #FBF7EE, ink #0B1F33, emerald #10B981, muted #7A879A).
 *
 * All user-provided strings MUST pass through escapeHtml() before being
 * interpolated into HTML.
 */

export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

export type WaitlistWelcomeOptions = {
  email: string;
  audience: "homeowner" | "tradesman";
};

export type JobPostedOptions = {
  jobId: string;
  service: string;
  description: string;
  min?: number;
  max?: number;
};

export type TradesmanApplicationOptions = {
  applicationId: string;
  fullName: string;
  trade: string;
};

// ─── Palette (mirrors src/app/globals.css light tokens) ─────────────

const PAPER = "#FBF7EE";
const CARD = "#FFFFFF";
const INK = "#0B1F33";
const INK_2 = "#34455A";
const INK_3 = "#7A879A";
const LINE = "#E3DAC3";
const EMERALD = "#10B981";
const EMERALD_DEEP = "#0B7F58";

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";
const MONO = "'Courier New', Courier, monospace";

/** Escape a user-provided string for safe interpolation into HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type LayoutOptions = {
  preheader: string;
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

/** Shared email shell: paper background, single 560px column, brand header. */
function renderLayout(opts: LayoutOptions): string {
  const cta =
    opts.ctaLabel && opts.ctaUrl
      ? `
          <tr>
            <td style="padding: 8px 0 24px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${EMERALD}" style="border-radius: 999px; background: linear-gradient(135deg, ${EMERALD} 0%, ${EMERALD_DEEP} 100%);">
                    <a href="${opts.ctaUrl}" style="display: inline-block; padding: 12px 28px; font-family: ${SANS}; font-size: 15px; font-weight: bold; color: #FFFFFF; text-decoration: none; border-radius: 999px;">${opts.ctaLabel}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FairFix.ie</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${PAPER};">
  <!-- Preheader: hidden preview text -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: ${PAPER};">${escapeHtml(opts.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAPER}" style="background-color: ${PAPER};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 560px;">

          <!-- Brand header -->
          <tr>
            <td style="padding: 0 4px 20px 4px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="28" height="28" bgcolor="${EMERALD}" style="width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, ${EMERALD} 0%, ${EMERALD_DEEP} 100%); font-size: 1px; line-height: 1px;">&nbsp;</td>
                  <td style="padding-left: 10px; font-family: ${SERIF}; font-size: 19px; font-weight: bold; color: ${INK};">FairFix.ie</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td bgcolor="${CARD}" style="background-color: ${CARD}; border: 1px solid ${LINE}; border-radius: 14px; padding: 32px 32px 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom: 16px; font-family: ${SERIF}; font-size: 24px; line-height: 30px; font-weight: bold; color: ${INK};">${opts.heading}</td>
                </tr>
                <tr>
                  <td style="font-family: ${SANS}; font-size: 15px; line-height: 23px; color: ${INK_2};">${opts.bodyHtml}</td>
                </tr>
                ${cta}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 8px 0 8px; font-family: ${SANS}; font-size: 12px; line-height: 18px; color: ${INK_3};" align="center">
              &copy; 2026 FairFix.ie &middot; Dublin<br>
              You're receiving this because you signed up at fairfix.pages.dev.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Small-caps mono-ish label (letter-spacing, no webfonts). */
function kicker(label: string): string {
  return `<span style="font-family: ${MONO}; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: ${INK_3};">${label}</span>`;
}

/** Reference id rendered in mono on a paper chip. */
function refChip(id: string): string {
  return `<span style="font-family: ${MONO}; font-size: 14px; color: ${INK}; background-color: ${PAPER}; border: 1px solid ${LINE}; border-radius: 6px; padding: 3px 8px;">${escapeHtml(id)}</span>`;
}

function para(inner: string): string {
  return `<p style="margin: 0 0 14px 0;">${inner}</p>`;
}

const TEXT_FOOTER = `
--
(c) 2026 FairFix.ie - Dublin
You're receiving this because you signed up at fairfix.pages.dev.`;

// ─── Waitlist welcome ───────────────────────────────────────────────

export function waitlistWelcomeEmail(
  opts: WaitlistWelcomeOptions
): EmailContent {
  if (opts.audience === "tradesman") {
    const subject = "FairFix — you're on the tradesman list";
    const bodyHtml =
      para(
        "Good to have you. FairFix is built so tradesmen keep more of what they earn — <strong>no lead fees, no pay-per-quote</strong>. Homeowners see a fair AI price first, and verified trades bid on real jobs."
      ) +
      para(
        "Before launch we verify every tradesman's credentials — RECI, RGII and Safe Pass where they apply — so the badge next to your name actually means something."
      ) +
      para(
        "We'll email you an invite to complete your profile and get verified before we open in your area. Nothing else to do for now."
      ) +
      para("Talk soon,<br>The FairFix team");
    const text = `Good to have you.

FairFix is built so tradesmen keep more of what they earn - no lead
fees, no pay-per-quote. Homeowners see a fair AI price first, and
verified trades bid on real jobs.

Before launch we verify every tradesman's credentials - RECI, RGII and
Safe Pass where they apply - so the badge next to your name actually
means something.

We'll email you an invite to complete your profile and get verified
before we open in your area. Nothing else to do for now.

Talk soon,
The FairFix team
${TEXT_FOOTER}`;
    return {
      subject,
      html: renderLayout({
        preheader:
          "No lead fees. We'll invite you to get verified before launch.",
        heading: "You're on the tradesman list",
        bodyHtml,
      }),
      text,
    };
  }

  const subject = "You're on the FairFix list";
  const bodyHtml =
    para(
      "Thanks for signing up. FairFix shows you a <strong>fair AI price first</strong> — before anyone quotes you — and then verified tradesmen bid for your job. No guesswork, no chancers."
    ) +
    para(
      "We'll email you once, when we open in your area. In the meantime, you can try the AI estimate now and see what your job should actually cost."
    ) +
    para("Talk soon,<br>The FairFix team");
  const text = `Thanks for signing up.

FairFix shows you a fair AI price first - before anyone quotes you -
and then verified tradesmen bid for your job. No guesswork, no
chancers.

We'll email you once, when we open in your area. In the meantime, you
can try the AI estimate now and see what your job should actually
cost:

  https://fairfix.pages.dev/estimate

Talk soon,
The FairFix team
${TEXT_FOOTER}`;
  return {
    subject,
    html: renderLayout({
      preheader:
        "A fair AI price first, then verified tradesmen bid. We'll email you when we open in your area.",
      heading: "You're on the list",
      bodyHtml,
      ctaLabel: "Try the AI estimate",
      ctaUrl: "https://fairfix.pages.dev/estimate",
    }),
    text,
  };
}

// ─── Job posted confirmation ────────────────────────────────────────

export function jobPostedEmail(opts: JobPostedOptions): EmailContent {
  const service = escapeHtml(opts.service);
  const subject = `Job received — ${opts.service}`;

  const hasRange =
    typeof opts.min === "number" && typeof opts.max === "number";
  const rangeHtml = hasRange
    ? para(
        `${kicker("Fair range")}<br><span style="font-family: ${SERIF}; font-size: 20px; font-weight: bold; color: ${EMERALD_DEEP};">&euro;${opts.min}&ndash;&euro;${opts.max}</span>`
      )
    : "";
  const rangeText = hasRange
    ? `\nFair range: EUR ${opts.min}-${opts.max}\n`
    : "";

  const bodyHtml =
    para(`We've got your <strong>${service}</strong> job. Here's your reference:`) +
    para(refChip(opts.jobId)) +
    para(
      `${kicker("Your description")}<br><em style="color: ${INK_2};">&ldquo;${escapeHtml(opts.description)}&rdquo;</em>`
    ) +
    rangeHtml +
    para(
      "<strong>What happens next:</strong> verified tradesmen will respond when FairFix opens in your area. Posting is free while we're in early access — you'll never be charged for this job."
    ) +
    para("Talk soon,<br>The FairFix team");

  const text = `We've got your ${opts.service} job.

Reference: ${opts.jobId}

Your description:
"${opts.description}"
${rangeText}
What happens next: verified tradesmen will respond when FairFix opens
in your area. Posting is free while we're in early access - you'll
never be charged for this job.

Talk soon,
The FairFix team
${TEXT_FOOTER}`;

  return {
    subject,
    html: renderLayout({
      preheader: `Your ${opts.service} job is in. Verified tradesmen respond when we open in your area.`,
      heading: "Job received",
      bodyHtml,
    }),
    text,
  };
}

// ─── Tradesman application confirmation ─────────────────────────────

export function tradesmanApplicationEmail(
  opts: TradesmanApplicationOptions
): EmailContent {
  const firstName = opts.fullName.trim().split(/\s+/)[0] || "there";
  const subject = "Application received — verification within 48h";

  const bodyHtml =
    para(`Hi ${escapeHtml(firstName)},`) +
    para(
      `Thanks for applying as a <strong>${escapeHtml(opts.trade)}</strong>. Your reference:`
    ) +
    para(refChip(opts.applicationId)) +
    para(
      "We hand-verify every application against the <strong>RECI and RGII registers</strong> and Safe Pass records — that's what makes a FairFix badge worth having. No bots, an actual person checks your credentials."
    ) +
    para(
      "Expect an email from us within <strong>48 hours</strong> with the outcome and your next steps."
    ) +
    para("Talk soon,<br>The FairFix team");

  const text = `Hi ${firstName},

Thanks for applying as a ${opts.trade}.

Reference: ${opts.applicationId}

We hand-verify every application against the RECI and RGII registers
and Safe Pass records - that's what makes a FairFix badge worth
having. No bots, an actual person checks your credentials.

Expect an email from us within 48 hours with the outcome and your
next steps.

Talk soon,
The FairFix team
${TEXT_FOOTER}`;

  return {
    subject,
    html: renderLayout({
      preheader:
        "We hand-verify credentials against RECI/RGII and Safe Pass. Expect an email within 48 hours.",
      heading: "Application received",
      bodyHtml,
    }),
    text,
  };
}
