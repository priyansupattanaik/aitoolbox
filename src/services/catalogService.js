import { SITE_CONFIG } from "../config/site.js";

const CATALOG_ENDPOINT = "/api/catalog";

/**
 * Loads the catalog from the site's own API. The API reads the Google Sheet
 * server-side, so no spreadsheet address ships in the browser bundle.
 *
 * @returns {Promise<object|null>}
 */
export async function loadCatalogFromSpreadsheet({ timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(CATALOG_ENDPOINT, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || !Array.isArray(data.groups) || !data.groups.length) return null;
    const entries = data.counts?.entries ?? 0;
    return {
      ...data,
      site: { title: SITE_CONFIG.title, author: SITE_CONFIG.author, language: SITE_CONFIG.language },
      description: `AI ToolBox lists ${entries} entries from the spreadsheet.`,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
