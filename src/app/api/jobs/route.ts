import { NextResponse } from "next/server";
import { getDb, newId } from "@/lib/db";
import { findService } from "@/lib/services";
import { sendEmailSafe } from "@/lib/email";
import { jobPostedEmail } from "@/lib/emails/templates";

export const runtime = "edge";

type EstimateBody = {
  min?: number;
  max?: number;
  confidence?: string;
  source?: string;
};

type Body = {
  email?: string;
  service?: string;
  description?: string;
  budget?: number;
  eircode?: string;
  estimate?: EstimateBody;
};

// Rudimentary email format check — same approach as the waitlist route.
// Accept obvious mistakes rather than pretend to be RFC-perfect.
function isEmailish(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 5 &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

const CONFIDENCES = ["low", "medium", "high"] as const;
const SOURCES = ["claude", "fallback"] as const;

type ValidEstimate = {
  min: number;
  max: number;
  confidence: (typeof CONFIDENCES)[number];
  source: (typeof SOURCES)[number];
};

// The estimates table has CHECK constraints on confidence/source, so only
// insert an estimate row when the payload fully matches the schema.
// A malformed estimate never blocks the job itself.
function validateEstimate(raw: EstimateBody | undefined): ValidEstimate | null {
  if (!raw) return null;
  if (
    typeof raw.min !== "number" ||
    typeof raw.max !== "number" ||
    !Number.isFinite(raw.min) ||
    !Number.isFinite(raw.max) ||
    raw.min < 0 ||
    raw.max < raw.min
  ) {
    return null;
  }
  const confidence = CONFIDENCES.find((c) => c === raw.confidence);
  const source = SOURCES.find((s) => s === raw.source);
  if (!confidence || !source) return null;
  return {
    min: Math.round(raw.min),
    max: Math.round(raw.max),
    confidence,
    source,
  };
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Send JSON with an email, service and description." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!isEmailish(email)) {
    return NextResponse.json(
      { ok: false, error: "That doesn't look like a valid email." },
      { status: 400 }
    );
  }

  const serviceSlug = (body.service ?? "").trim().toLowerCase();
  const service = findService(serviceSlug);
  if (!service) {
    return NextResponse.json(
      { ok: false, error: "Pick a service from the list." },
      { status: 400 }
    );
  }

  const description = (body.description ?? "").trim();
  if (description.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Describe the job in a sentence or two." },
      { status: 400 }
    );
  }
  if (description.length > 2000) {
    return NextResponse.json(
      { ok: false, error: "Keep the description under 2000 characters." },
      { status: 400 }
    );
  }

  const budget =
    typeof body.budget === "number" &&
    Number.isFinite(body.budget) &&
    body.budget >= 0
      ? Math.round(body.budget)
      : undefined;
  const eircode = body.eircode?.trim().slice(0, 8) || undefined;
  const estimate = validateEstimate(body.estimate);

  const jobId = newId("job");
  const db = getDb();

  // Graceful degradation — same philosophy as the waitlist route. If the D1
  // binding isn't attached yet (local dev, brand-new deploy) we never fail
  // the user; the write is best-effort and we say so via `persisted`.
  // Confirmation email is fire-and-safe: an email outage never fails the post.
  const confirmation = jobPostedEmail({
    jobId,
    service: service.name,
    description,
    min: estimate?.min,
    max: estimate?.max,
  });

  if (!db) {
    console.log("[jobs] D1 not bound; job not persisted:", {
      id: jobId,
      service: service.slug,
    });
    await sendEmailSafe({ to: email, ...confirmation });
    return NextResponse.json(
      { ok: true, id: jobId, persisted: false },
      { status: 200 }
    );
  }

  try {
    let estimateId: string | null = null;
    if (estimate) {
      estimateId = newId("est");
      await db
        .prepare(
          `INSERT INTO estimates
             (id, service, description, budget_eur, eircode, min_eur, max_eur, confidence, source)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
        )
        .bind(
          estimateId,
          service.slug,
          description,
          budget ?? null,
          eircode ?? null,
          estimate.min,
          estimate.max,
          estimate.confidence,
          estimate.source
        )
        .run();
    }

    await db
      .prepare(
        `INSERT INTO jobs
           (id, customer_email, service, description, budget_eur, eircode, status, estimate_id)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'open', ?7)`
      )
      .bind(
        jobId,
        email,
        service.slug,
        description,
        budget ?? null,
        eircode ?? null,
        estimateId
      )
      .run();

    await sendEmailSafe({ to: email, ...confirmation });
    return NextResponse.json(
      { ok: true, id: jobId, persisted: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("[jobs] D1 write failed:", err);
    // Deliberately do not fail the user; they posted in good faith.
    await sendEmailSafe({ to: email, ...confirmation });
    return NextResponse.json(
      { ok: true, id: jobId, persisted: false },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "POST { email, service, description, budget?, eircode?, estimate? } to this endpoint.",
    },
    { status: 405 }
  );
}
