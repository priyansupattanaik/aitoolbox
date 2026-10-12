import { ENV } from "../config/env.js";
import { SITE_CONFIG } from "../config/site.js";
import { parseCsv, rowsToObjects } from "../utils/csvParser.js";
import { validateIsoDate } from "../utils/formatters.js";
import { hostFromUrl, safeHttpUrl } from "../utils/url.js";

/**
 * Builds the Google Sheet CSV export URL.
 *
 * @param {string} gid Sheet sub-tab GID
 * @returns {string}
 */
export function buildSheetCsvUrl(gid) {
  const params = new URLSearchParams({ format: "csv", gid });
  return `https://docs.google.com/spreadsheets/d/${ENV.SHEET_ID}/export?${params}`;
}

/**
 * Fetches and parses a single Google Sheet tab as CSV with timeout.
 *
 * @param {string} gid
 * @param {number} timeoutMs
 * @returns {Promise<Record<string, string>[]|null>}
 */
export async function fetchSheetCsv(gid, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = buildSheetCsvUrl(gid);
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(`[CatalogService] Sheet tab fetch failed for GID ${gid} with status ${response.status}`);
      return null;
    }

    const text = await response.text();
    // Google Sheets returns an HTML error page if sheet ID or GID is invalid or unshared
    if (!text || text.trimStart().startsWith("<")) {
      console.warn(`[CatalogService] Received HTML instead of CSV for GID ${gid}`);
      return null;
    }

    const rows = parseCsv(text);
    if (rows.length < 2) {
      console.warn(`[CatalogService] CSV for GID ${gid} had insufficient rows`);
      return null;
    }

    return rowsToObjects(rows);
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn(`[CatalogService] Request timed out for GID ${gid}`);
    } else {
      console.warn(`[CatalogService] Error fetching sheet GID ${gid}:`, error.message);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetches and transforms the live Google Sheet catalog.
 * Zero hallucination: strictly parses rows from the official sheet.
 *
 * @returns {Promise<object|null>} Complete normalized catalog object or null on failure.
 */
export async function loadCatalogFromSpreadsheet() {
  try {
    const [toolRows, catRows] = await Promise.all([
      fetchSheetCsv(ENV.TOOLS_GID),
      fetchSheetCsv(ENV.CATEGORIES_GID),
    ]);

    if (!toolRows || !toolRows.length) {
      return null;
    }

    const categories = (catRows || [])
      .filter((row) => row.id && row.name)
      .map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description || "",
      }));

    const categoryById = new Map(categories.map((category) => [category.id, category]));

    const groups = [];
    const groupById = new Map();
    let index = 0;

    for (const row of toolRows) {
      const name = (row.name || "").trim();
      if (!name) continue;

      const categoryId = (row.category || "").trim();
      const known = categoryById.get(categoryId);
      const groupKey = categoryId || "(none)";

      if (!groupById.has(groupKey)) {
        const category = known
          ? { id: known.id, name: known.name, description: known.description }
          : {
              id: groupKey,
              name: categoryId || "Uncategorized",
              description: "",
            };
        const group = { category, tools: [] };
        groupById.set(groupKey, group);
        groups.push(group);
      }

      index += 1;
      const rawUrl = (row.url || "").trim();
      const rawId = (row.id || "").trim() || name;

      groupById.get(groupKey).tools.push({
        id: rawId,
        name,
        description: (row.description || "").trim(),
        url: rawUrl,
        host: hostFromUrl(rawUrl),
        category: groupKey,
        icon: (row.icon || "").trim(),
        added: validateIsoDate(row.date_added || ""),
        source: (row.source || "").trim(),
        sourceUrl: safeHttpUrl(row.source_url || "") || "",
        sourceScreenshot: safeHttpUrl(row.source_screenshot_url || "") || "",
        sourceNote: (row.source_note || "").trim(),
        index,
      });
    }

    if (!groups.length) return null;
    const entries = groups.reduce((count, group) => count + group.tools.length, 0);

    return {
      site: {
        title: SITE_CONFIG.title,
        author: SITE_CONFIG.author,
        language: SITE_CONFIG.language,
      },
      source: "spreadsheet",
      description: `AI ToolBox lists ${entries} entries from the spreadsheet.`,
      counts: { entries, categories: groups.length },
      groups,
    };
  } catch (error) {
    console.error("[CatalogService] Failed to load catalog:", error);
    return null;
  }
}
