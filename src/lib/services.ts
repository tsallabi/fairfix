/**
 * The service catalogue used by the estimate flow. Kept in one file so the
 * form, the API and (later) the admin panel all stay in sync.
 *
 * Prices below are typical Dublin market ranges as of 2026 — used as a
 * fallback when the Anthropic API key isn't configured. The real estimate
 * comes from Claude.
 */

export type ServiceCategory = {
  slug: string;
  name: string;
  description: string;
  gradient:
    | "blue"
    | "teal"
    | "orange"
    | "plum"
    | "forest"
    | "rose"
    | "slate"
    | "ochre";
  icon:
    | "bolt"
    | "wrench"
    | "flame"
    | "broom"
    | "paint"
    | "leaf"
    | "truck"
    | "box";
  fallbackRange: { min: number; max: number };
};

export const services: ServiceCategory[] = [
  {
    slug: "electrician",
    name: "Electrician",
    description: "Sockets, tripping fuses, lights, rewiring, EV chargers",
    gradient: "blue",
    icon: "bolt",
    fallbackRange: { min: 80, max: 220 },
  },
  {
    slug: "plumber",
    name: "Plumber",
    description: "Leaks, toilets, taps, water pressure, radiators",
    gradient: "teal",
    icon: "wrench",
    fallbackRange: { min: 90, max: 240 },
  },
  {
    slug: "heating",
    name: "Heating & Gas",
    description: "Boiler service, gas fitting, radiator balancing",
    gradient: "orange",
    icon: "flame",
    fallbackRange: { min: 100, max: 320 },
  },
  {
    slug: "cleaning",
    name: "Cleaning",
    description: "End-of-tenancy, deep clean, one-off or recurring",
    gradient: "plum",
    icon: "broom",
    fallbackRange: { min: 80, max: 300 },
  },
  {
    slug: "painter",
    name: "Painter",
    description: "Interior, exterior, small touch-ups to whole houses",
    gradient: "rose",
    icon: "paint",
    fallbackRange: { min: 120, max: 900 },
  },
  {
    slug: "gardener",
    name: "Gardener",
    description: "Lawn, hedges, weeding, seasonal tidy-ups",
    gradient: "forest",
    icon: "leaf",
    fallbackRange: { min: 60, max: 260 },
  },
  {
    slug: "removals",
    name: "Removals",
    description: "Man with a van, one-bed flat, full house move",
    gradient: "slate",
    icon: "truck",
    fallbackRange: { min: 80, max: 480 },
  },
  {
    slug: "assembly",
    name: "Assembly",
    description: "IKEA and flat-pack furniture, shelves, storage",
    gradient: "ochre",
    icon: "box",
    fallbackRange: { min: 50, max: 180 },
  },
];

export function findService(slug: string): ServiceCategory | undefined {
  return services.find((s) => s.slug === slug);
}
