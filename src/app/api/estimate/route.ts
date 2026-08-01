import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { callClaude, ClaudeError, extractJson } from "@/lib/claude";
import { findService } from "@/lib/services";

export const runtime = "edge";

type Body = {
  service?: string;
  description?: string;
  budget?: number;
  eircode?: string;
};

type ClaudeEstimate = {
  min_eur: number;
  max_eur: number;
  confidence: "low" | "medium" | "high";
  sample_note: string;
  scope_note: string;
};

type EstimateResponse = {
  ok: true;
  service: string;
  min: number;
  max: number;
  currency: "EUR";
  confidence: "low" | "medium" | "high";
  sampleNote: string;
  scopeNote: string;
  source: "claude" | "fallback";
  model?: string;
};

const SYSTEM_PROMPT = `You are FairFix's fair-price AI for Ireland's home services market (2026). Your ONLY job is to give homeowners a fair price RANGE for a specific service they describe. FairFix is fair-price marketplace connecting Irish homeowners with RECI / RGII / Safe-Pass verified tradesmen.

STRICT RULES:
1. NEVER diagnose the fault or suggest the cause. You do not know the fault.
2. ALWAYS return a range in Euros (min and max), never a single number.
3. Base the range on TYPICAL 2026 Irish market rates for the described job.
4. Adjust for scope hints in the description (parts needed, out-of-hours, urgency).
5. If the description is too vague to price fairly, widen the range and mark confidence "low".
6. If it references an SEAI-grant-eligible service (EV charger install, attic insulation, solar PV, heat pump), state that grants may apply in scope_note.
7. Emergency call-outs (24/7, out-of-hours) command a premium — reflect it in the max.
8. Return ONLY a valid JSON object matching the schema below. No prose. No code fences. No apologies.

SCHEMA:
{
  "min_eur": integer,          // lower bound of the fair range in EUR
  "max_eur": integer,          // upper bound of the fair range in EUR
  "confidence": "low" | "medium" | "high",
  "sample_note": string,       // short factual line: what this range is based on (e.g. "Typical Dublin range for kitchen socket faults")
  "scope_note": string         // one line: what's included or an important caveat (e.g. "Labour + one RCD replacement. Larger rewires cost more.")
}`;

function buildUserPrompt(input: {
  serviceName: string;
  description: string;
  budgetEur?: number;
  eircode?: string;
}): string {
  const parts = [
    `Service: ${input.serviceName}`,
    `Location: Dublin, Ireland${input.eircode ? ` (Eircode ${input.eircode})` : ""}`,
    `Description: ${input.description}`,
  ];
  if (input.budgetEur && input.budgetEur > 0) {
    parts.push(`Customer's soft budget hint: €${input.budgetEur}`);
  }
  parts.push("\nReturn the JSON object only.");
  return parts.join("\n");
}

function fallbackEstimate(
  serviceSlug: string,
  serviceName: string
): EstimateResponse {
  const service = findService(serviceSlug);
  const min = service?.fallbackRange.min ?? 80;
  const max = service?.fallbackRange.max ?? 320;
  return {
    ok: true,
    service: serviceName,
    min,
    max,
    currency: "EUR",
    confidence: "low",
    sampleNote: "Typical Irish market range (offline fallback — AI not configured).",
    scopeNote:
      "This is a rough guide. Connect the ANTHROPIC_API_KEY environment variable to enable AI-generated estimates.",
    source: "fallback",
  };
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Send JSON with a service and description." },
      { status: 400 }
    );
  }

  const serviceSlug = (body.service ?? "").trim().toLowerCase();
  const description = (body.description ?? "").trim();
  const budget =
    typeof body.budget === "number" && body.budget >= 0
      ? Math.round(body.budget)
      : undefined;
  const eircode = body.eircode?.trim().slice(0, 8) || undefined;

  const service = findService(serviceSlug);
  if (!service) {
    return NextResponse.json(
      { ok: false, error: "Pick a service from the list." },
      { status: 400 }
    );
  }
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

  let apiKey: string | undefined;
  try {
    const { env } = getRequestContext();
    apiKey = (env as unknown as { ANTHROPIC_API_KEY?: string }).ANTHROPIC_API_KEY;
  } catch {
    apiKey = process.env.ANTHROPIC_API_KEY;
  }

  if (!apiKey) {
    // Graceful demo: return a market-typical range so the UI still works
    // before the user wires their Anthropic key in Cloudflare Pages.
    return NextResponse.json(fallbackEstimate(service.slug, service.name), {
      status: 200,
    });
  }

  try {
    const claude = await callClaude({
      apiKey,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt({
            serviceName: service.name,
            description,
            budgetEur: budget,
            eircode,
          }),
        },
      ],
      maxTokens: 400,
      temperature: 0.2,
    });

    let parsed: ClaudeEstimate;
    try {
      parsed = extractJson<ClaudeEstimate>(claude.text);
    } catch (err) {
      console.error("[estimate] Failed to parse Claude JSON:", err, claude.text);
      return NextResponse.json(fallbackEstimate(service.slug, service.name), {
        status: 200,
      });
    }

    if (
      typeof parsed.min_eur !== "number" ||
      typeof parsed.max_eur !== "number" ||
      parsed.min_eur < 0 ||
      parsed.max_eur < parsed.min_eur
    ) {
      return NextResponse.json(fallbackEstimate(service.slug, service.name), {
        status: 200,
      });
    }

    const response: EstimateResponse = {
      ok: true,
      service: service.name,
      min: Math.round(parsed.min_eur),
      max: Math.round(parsed.max_eur),
      currency: "EUR",
      confidence: parsed.confidence ?? "medium",
      sampleNote: parsed.sample_note ?? "",
      scopeNote: parsed.scope_note ?? "",
      source: "claude",
      model: "claude-sonnet-5",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    if (err instanceof ClaudeError) {
      console.error("[estimate] Claude error", err.status, err.detail);
      // For known rate-limit / auth errors, fall back so the UX keeps working.
      if (err.status === 401 || err.status === 429 || err.status >= 500) {
        return NextResponse.json(fallbackEstimate(service.slug, service.name), {
          status: 200,
        });
      }
    } else {
      console.error("[estimate] Unexpected error:", err);
    }
    return NextResponse.json(fallbackEstimate(service.slug, service.name), {
      status: 200,
    });
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "POST { service, description, budget?, eircode? } to this endpoint.",
    },
    { status: 405 }
  );
}
