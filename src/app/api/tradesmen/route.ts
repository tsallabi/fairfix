import { NextResponse } from "next/server";
import { getDb, newId } from "@/lib/db";
import { findService } from "@/lib/services";
import { sendEmailSafe } from "@/lib/email";
import { tradesmanApplicationEmail } from "@/lib/emails/templates";

export const runtime = "edge";

type Body = {
  email?: string;
  fullName?: string;
  trade?: string;
  serviceArea?: string;
  reciNumber?: string;
  rgiiNumber?: string;
  safePassNumber?: string;
  publicLiability?: string;
};

// Rudimentary email format check — same approach as the waitlist route.
// Full validation happens on the round-trip verification email later.
function isEmailish(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 5 &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

/** Optional credential field: trim, cap at 60 chars, empty → undefined. */
function optionalCredential(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length <= 60 ? trimmed : undefined;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Send JSON with your registration details." },
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

  const fullName = (body.fullName ?? "").trim();
  if (fullName.length < 2 || fullName.length > 100) {
    return NextResponse.json(
      { ok: false, error: "Enter your full name (2–100 characters)." },
      { status: 400 }
    );
  }

  const tradeSlug = (body.trade ?? "").trim().toLowerCase();
  const service = findService(tradeSlug);
  if (!service) {
    return NextResponse.json(
      { ok: false, error: "Pick your trade from the list." },
      { status: 400 }
    );
  }

  const serviceArea = (body.serviceArea ?? "").trim();
  if (serviceArea.length < 2 || serviceArea.length > 120) {
    return NextResponse.json(
      {
        ok: false,
        error: "Tell us the area you cover (2–120 characters).",
      },
      { status: 400 }
    );
  }

  // Credentials: each optional, but any provided value must fit in 60 chars.
  for (const [label, raw] of [
    ["RECI number", body.reciNumber],
    ["RGII number", body.rgiiNumber],
    ["Safe Pass number", body.safePassNumber],
    ["Public liability policy no.", body.publicLiability],
  ] as const) {
    if (typeof raw === "string" && raw.trim().length > 60) {
      return NextResponse.json(
        { ok: false, error: `Keep the ${label} under 60 characters.` },
        { status: 400 }
      );
    }
  }

  const reciNumber = optionalCredential(body.reciNumber);
  const rgiiNumber = optionalCredential(body.rgiiNumber);
  const safePassNumber = optionalCredential(body.safePassNumber);
  const publicLiability = optionalCredential(body.publicLiability);

  if (!reciNumber && !rgiiNumber && !safePassNumber) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "At least one credential (RECI, RGII or Safe Pass) is required.",
      },
      { status: 400 }
    );
  }

  const id = newId("tm");

  const db = getDb();
  if (!db) {
    // D1 not bound yet (local dev, brand-new deploy) — degrade gracefully,
    // same pattern as the waitlist route.
    console.log("[tradesmen] DB not bound; registration not persisted:", {
      id,
      email,
      fullName,
      trade: service.slug,
      serviceArea,
    });
    await sendEmailSafe({
      to: email,
      ...tradesmanApplicationEmail({
        applicationId: id,
        fullName,
        trade: service.name,
      }),
    });
    return NextResponse.json(
      { ok: true, id, persisted: false },
      { status: 200 }
    );
  }

  try {
    const existing = await db
      .prepare("SELECT id FROM tradesmen WHERE email = ?")
      .bind(email)
      .first<{ id: string }>();
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "This email is already registered. We'll be in touch about verification.",
        },
        { status: 409 }
      );
    }

    await db
      .prepare(
        `INSERT INTO tradesmen
           (id, email, full_name, trade, service_area,
            reci_number, rgii_number, safe_pass_number, public_liability)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        email,
        fullName,
        service.slug,
        serviceArea,
        reciNumber ?? null,
        rgiiNumber ?? null,
        safePassNumber ?? null,
        publicLiability ?? null
      )
      .run();
  } catch (err) {
    console.error("[tradesmen] D1 write failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong saving your application. Try again." },
      { status: 500 }
    );
  }

  await sendEmailSafe({
    to: email,
    ...tradesmanApplicationEmail({
      applicationId: id,
      fullName,
      trade: service.name,
    }),
  });

  return NextResponse.json({ ok: true, id, persisted: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "POST { email, fullName, trade, serviceArea, reciNumber?, rgiiNumber?, safePassNumber?, publicLiability? } to this endpoint.",
    },
    { status: 405 }
  );
}
