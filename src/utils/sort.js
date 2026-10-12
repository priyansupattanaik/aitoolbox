import { compareNames } from "./formatters.js";

/** Sort options. Every option sorts on a real field from the sheet row. */
export const SORT_OPTIONS = [
  { id: "name-asc", label: "Name (A–Z)" },
  { id: "name-desc", label: "Name (Z–A)" },
  { id: "newest", label: "Newest added" },
  { id: "oldest", label: "Oldest added" },
  { id: "category", label: "Category" },
  { id: "source", label: "Source platform" },
  { id: "github-first", label: "Has GitHub repo first" },
];

export const DEFAULT_SORT = "name-asc";

export function isSortId(id) {
  return SORT_OPTIONS.some((o) => o.id === id);
}

const byName = (a, b) => compareNames(a.name, b.name) || (a.index ?? 0) - (b.index ?? 0);

/** Compares two optional strings, always placing empty values last. */
function emptyLast(a, b, cmp) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return cmp(a, b);
}

const COMPARATORS = {
  "name-asc": byName,
  "name-desc": (a, b) => compareNames(b.name, a.name) || (a.index ?? 0) - (b.index ?? 0),
  newest: (a, b) => emptyLast(a.added, b.added, (x, y) => (x < y ? 1 : x > y ? -1 : 0)) || byName(a, b),
  oldest: (a, b) => emptyLast(a.added, b.added, (x, y) => (x < y ? -1 : x > y ? 1 : 0)) || byName(a, b),
  category: (a, b) => emptyLast(a.categoryName, b.categoryName, compareNames) || byName(a, b),
  source: (a, b) => emptyLast(a.source, b.source, compareNames) || byName(a, b),
  "github-first": (a, b) => Number(Boolean(b.github)) - Number(Boolean(a.github)) || byName(a, b),
};

/** Returns a new sorted array; the input is never mutated. */
export function sortTools(tools, sortId = DEFAULT_SORT) {
  const cmp = COMPARATORS[sortId] || COMPARATORS[DEFAULT_SORT];
  return [...(tools || [])].sort(cmp);
}
