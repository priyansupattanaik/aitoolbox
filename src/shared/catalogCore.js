/**
 * Shared catalog logic. Used by the Netlify Function (server) and by tests.
 * The browser never imports this file, so the spreadsheet id stays server-side.
 */
import { parseCsv, rowsToObjects } from "../utils/csvParser.js";
import { validateIsoDate } from "../utils/formatters.js";
import { hostFromUrl, safeHttpUrl } from "../utils/url.js";

export const DEFAULT_SHEET = {
  sheetId: "1-IwOX6VT-09OXTnzturlks0VtvcRHtPrIIx58jCMfrM",
  toolsGid: "1104429197",
  categoriesGid: "119010883",
};

export function sheetConfigFromEnv(env = {}) {
  return {
    sheetId: (env.SHEET_ID || DEFAULT_SHEET.sheetId).trim(),
    toolsGid: (env.TOOLS_GID || DEFAULT_SHEET.toolsGid).trim(),
    categoriesGid: (env.CATEGORIES_GID || DEFAULT_SHEET.categoriesGid).trim(),
  };
}

export function buildSheetCsvUrl(sheetId, gid) {
  const params = new URLSearchParams({ format: "csv", gid });
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/export?${params}`;
}

/** Parses CSV text from Google into row objects, or null if it is not CSV. */
export function csvTextToRows(text) {
  if (!text || text.trimStart().startsWith("<")) return null;
  const rows = parseCsv(text);
  if (rows.length < 2) return null;
  return rowsToObjects(rows);
}

export async function fetchSheetRows(sheetId, gid, { fetchImpl = fetch, timeoutMs = 10000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(buildSheetCsvUrl(sheetId, gid), { signal: controller.signal, redirect: "follow" });
    if (!response.ok) return null;
    return csvTextToRows(await response.text());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const clean = (value) => String(value || "").trim();

/**
 * Turns sheet rows into the public catalog. Only fields the UI renders are kept;
 * every URL is restricted to http/https.
 */
export function buildCatalog(toolRows, catRows) {
  if (!Array.isArray(toolRows) || !toolRows.length) return null;

  const categories = (catRows || [])
    .filter((row) => clean(row.id) && clean(row.name))
    .map((row) => ({ id: clean(row.id), name: clean(row.name), description: clean(row.description) }));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const groups = [];
  const groupById = new Map();
  let index = 0;

  for (const row of toolRows) {
    const name = clean(row.name);
    if (!name) continue;

    const categoryId = clean(row.category);
    const groupKey = categoryId || "(none)";
    if (!groupById.has(groupKey)) {
      const known = categoryById.get(categoryId);
      const group = {
        category: known
          ? { ...known }
          : { id: groupKey, name: categoryId || "Uncategorized", description: "" },
        tools: [],
      };
      groupById.set(groupKey, group);
      groups.push(group);
    }

    index += 1;
    const url = safeHttpUrl(row.url) || "";
    groupById.get(groupKey).tools.push({
      id: clean(row.id) || name,
      name,
      description: clean(row.description),
      url,
      host: hostFromUrl(url),
      category: groupKey,
      icon: clean(row.icon),
      added: validateIsoDate(clean(row.date_added)),
      source: clean(row.source),
      sourceUrl: safeHttpUrl(row.source_url) || "",
      sourceScreenshot: safeHttpUrl(row.source_screenshot_url) || "",
      sourceNote: clean(row.source_note),
      index,
    });
  }

  if (!groups.length) return null;
  const entries = groups.reduce((n, g) => n + g.tools.length, 0);
  return {
    source: "spreadsheet",
    counts: { entries, categories: groups.length },
    groups,
  };
}

export async function loadCatalogFromSheet(config = DEFAULT_SHEET, options = {}) {
  const [toolRows, catRows] = await Promise.all([
    fetchSheetRows(config.sheetId, config.toolsGid, options),
    fetchSheetRows(config.sheetId, config.categoriesGid, options),
  ]);
  return buildCatalog(toolRows, catRows);
}
