import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type Body = {
  email?: string;
  audience?: "homeowner" | "tradesman";
};

// Rudimentary email format check. Accept obvious mistakes rather than pretend
// to be RFC-perfect. Full validation happens on the round-trip confirmation
// email once we hook Resend in Phase 2.
function isEmailish(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 5 &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "Send JSON with an email field." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  const audience = body.audience === "tradesman" ? "tradesman" : "homeowner";

  if (!isEmailish(email)) {
    return NextResponse.json(
      { error: "That doesn't look like a valid email." },
      { status: 400 }
    );
  }

  const record = {
    email,
    audience,
    ip: request.headers.get("cf-connecting-ip") ?? null,
    ua: request.headers.get("user-agent") ?? null,
    added_at: new Date().toISOString(),
  };

  // Try to persist to Cloudflare KV. If the binding isn't configured yet
  // (local dev, brand-new deploy) we still return success so the user gets
  // a working flow; the write is best-effort.
  try {
    const { env } = getRequestContext();
    const kv = (env as unknown as { WAITLIST?: KVNamespace }).WAITLIST;
    if (kv) {
      const key = `wl:${email}`;
      const existing = await kv.get(key);
      if (!existing) {
        await kv.put(key, JSON.stringify(record), {
          metadata: { audience, added_at: record.added_at },
        });
      }
    } else {
      // Nothing bound: log so we can spot it in Cloudflare Pages logs.
      console.log("[waitlist] KV not bound; email not persisted:", record);
    }
  } catch (err) {
    console.error("[waitlist] KV write failed:", err);
    // Deliberately do not fail the user here; they signed up in good faith.
  }

  return NextResponse.json(
    { ok: true, email, audience },
    { status: 200 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "POST an email to this endpoint." },
    { status: 405 }
  );
}
