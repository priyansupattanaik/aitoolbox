/** The one-line text shown on a tool card: short_description, else the full description. */
export function cardSummary(tool) {
  const short = String(tool?.shortDescription || "").replace(/\s+/g, " ").trim();
  if (short) return short;
  return String(tool?.description || "").replace(/\s+/g, " ").trim();
}

/**
 * The newest tools by date added (YYYY-MM-DD). Tools without a real date are ignored.
 * Ties on the same date go to the tool lower in the sheet (higher index) first.
 */
export function recentlyAdded(tools, limit = 5) {
  return (Array.isArray(tools) ? tools : [])
    .filter((t) => /^\d{4}-\d{2}-\d{2}$/.test(t?.added || ""))
    .slice()
    .sort((a, b) => (a.added < b.added ? 1 : a.added > b.added ? -1 : (b.index || 0) - (a.index || 0)))
    .slice(0, limit);
}
