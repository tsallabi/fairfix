# FairFix.ie

Ireland's fair-price home services marketplace. Homeowners describe a job, get an AI-generated fair price estimate, then choose from RECI / RGII / Safe-Pass verified Irish tradesmen who bid on it.

## What's in this repo

| File | What it is |
|---|---|
| `index.html` | Public marketing landing page (the front door of fairfix.ie) |
| `gallery.html` | Design gallery — navigation to all six deliverables |
| `app.html` | 6-screen interactive prototype with real navigation and AI reveal |
| `visual.html` | Hi-fidelity three-screen visual preview with design notes |
| `wireframes.html` | v1 structural wireframes for engineering handoff |
| `rating.html` | Two-sided rating system prototype (6 screens) |
| `scope-revision.html` | Scope revision flow prototype (5 screens) |
| `.nojekyll` | Tells GitHub Pages to serve raw HTML instead of running Jekyll |

Every file is self-contained (all CSS / JS / SVG inline, no external fonts or scripts) so it renders anywhere.

## Live URLs (once GitHub Pages is enabled)

- Landing page: **https://tsallabi.github.io/fairfix/**
- Design gallery: **https://tsallabi.github.io/fairfix/gallery.html**
- Interactive prototype: **https://tsallabi.github.io/fairfix/app.html**

## Enabling GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch: **main** / Folder: **/ (root)** → Save.

## Design system

- **Ground**: warm paper `#FBF7EE` (not sterile white)
- **Ink**: deep navy `#0B1F33`
- **Accent**: emerald `#10B981` — means "this is working"
- **Signal**: coral `#F26D5B` — emergencies only
- **Attention**: amber `#E6A429` — ratings and earned attention
- **Display type**: `Iowan Old Style` / Palatino / Georgia serif
- **Body type**: `-apple-system` / Inter / Helvetica sans
- **Utility type**: `ui-monospace` / SF Mono / Menlo

All numbers wear the display serif. One accent per screen. Trust is specific (`RECI verified` not `trusted`, `replied 3 min` not `fast`). Every screen respects `prefers-reduced-motion` and works in light + dark themes.

## Product context

Differentiator vs Bark.com / Tradesmen.ie / Airtasker: the AI shows a fair price *before* any tradesman is chosen. A €15 inspection fee is held in escrow — released only when the tradesman arrives, refunded automatically if they don't.
