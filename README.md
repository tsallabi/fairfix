# FairFix.ie

Ireland's fair-price marketplace for home services. Homeowners describe a job,
get an AI-generated fair price estimate, then choose from RECI / RGII / Safe-Pass
verified Irish tradesmen who bid on it.

**Live**: <https://fairfix.pages.dev> · **Domain**: `fairfix.ie` (coming soon)

## Tech stack

- **Next.js 14** (App Router, React Server Components)
- **TypeScript** (strict)
- **Tailwind CSS 3** + inline CSS variables for the design tokens
- **Cloudflare Pages** (hosting + edge)
- **Cloudflare KV** (waitlist storage, Phase 1)
- **Supabase** (auth + database, Phase 2)
- **Anthropic Claude API** (AI price estimation, Phase 3)
- **Stripe** (escrow + payouts, Phase 4)

## What's shipped (Phase 1)

- ✅ Landing page — hero, trust bar, how-it-works, AI feature highlight,
  tradesman CTA, FAQ, footer
- ✅ Working waitlist form → `/api/waitlist` → Cloudflare KV
- ✅ Both light and dark themes with a persistent toggle
- ✅ Full design gallery preserved under `/demos/`
- ✅ Cloudflare Pages deploy config (`wrangler.toml`, `next.config.mjs`)

## What's next (Phase 2 – ongoing)

- Supabase auth (magic-link login)
- Database schema for users, jobs, offers, ratings
- Customer dashboard skeleton
- Tradesman verification flow

## Design gallery

Every static design deliverable is served from `/demos/`:

| Path | What |
|---|---|
| `/demos/gallery.html` | Navigation hub for all designs |
| `/demos/landing.html` | Static landing page design (v1) |
| `/demos/app.html` | 6-screen customer app prototype |
| `/demos/tradesman.html` | 7-screen tradesman app prototype |
| `/demos/admin.html` | Desktop admin console |
| `/demos/visual.html` | Full visual language showcase |
| `/demos/wireframes.html` | Structural wireframes |
| `/demos/rating.html` | Two-sided rating system |
| `/demos/scope-revision.html` | Scope revision flow |

## Getting started (local development)

```bash
# 1. Install
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Run dev server
npm run dev
# → http://localhost:3000

# 4. Type-check + lint
npm run typecheck
npm run lint
```

## Deploying to Cloudflare Pages

The `fairfix` Cloudflare Pages project is wired to this repo's `main`
branch. Every push to `main` triggers a build.

**Build settings** (already set in Cloudflare Pages dashboard):

| Field | Value |
|---|---|
| Framework preset | Next.js |
| Build command | `npx @cloudflare/next-on-pages@1` |
| Build output directory | `.vercel/output/static` |
| Root directory | `/` (empty) |
| Node version | `20` |
| Compatibility flags | `nodejs_compat` |

**KV binding** (needed for the waitlist to persist):

1. In the Cloudflare dashboard, **Workers & Pages → KV → Create namespace**,
   name it `fairfix-waitlist`. Copy the namespace ID.
2. In your Pages project, **Settings → Functions → KV namespace bindings**,
   add: `WAITLIST` → the namespace you just created.
3. Redeploy. The `/api/waitlist` endpoint now persists to KV.

Until the KV binding is set, submissions still return success — they're just
logged to the Cloudflare Pages logs rather than persisted.

## Design system

The design tokens live in `src/app/globals.css` as CSS custom properties and
in `tailwind.config.ts` as Tailwind theme tokens. Both are kept in sync.

- **Ground**: warm paper `#FBF7EE` (not sterile white)
- **Ink**: deep navy `#0B1F33`
- **Accent** (emerald `#10B981`): means *this is working*
- **Signal** (coral `#F26D5B`): emergencies only
- **Attention** (amber `#E6A429`): ratings and earned attention
- **Display type**: Iowan Old Style / Palatino / Georgia serif
- **Body type**: system sans stack (`-apple-system`, Inter, Helvetica)
- **Utility type**: `ui-monospace` / SF Mono / Menlo

All numbers wear the display serif. One accent per screen. Trust is specific
(`RECI verified`, not `trusted`; `replied 3 min`, not `fast`). Every screen
respects `prefers-reduced-motion`.

## Project structure

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # root layout + metadata
│   │   ├── page.tsx            # landing page (server component)
│   │   ├── globals.css         # design tokens + base styles
│   │   └── api/
│   │       └── waitlist/
│   │           └── route.ts    # POST /api/waitlist (edge runtime)
│   └── components/
│       ├── SiteNav.tsx
│       ├── ThemeToggle.tsx     # client component
│       └── WaitlistForm.tsx    # client component
├── public/
│   └── demos/                  # static HTML design deliverables
├── next.config.mjs
├── tailwind.config.ts
├── wrangler.toml               # Cloudflare Pages config
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## License

Proprietary — © 2026 FairFix.ie. All rights reserved.
