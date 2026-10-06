/**
 * Live catalog from Google Sheet AIToolBox DB (gviz CSV).
 * Returns null on any failure so the app can fall back to catalog.json.
 */
const SHEET_ID = "1-IwOX6VT-09OXTnzturlks0VtvcRHtPrIIx58jCMfrM";

const SITE = {
  title: "AI ToolBox",
  author: "Priyansu Pattanaik",
  language: "en",
};

const ABOUT = [
  "AI ToolBox is the directory of this file. The page lists every entry below and groups them by category.",
  "The name, description, and URL on each entry are copied from this file. A description is catalog text. It is not a review, a price, or a check that the link still opens.",
  "Entries are loaded live from the AIToolBox DB Google Sheet when available.",
  "The previous page metadata names Priyansu Pattanaik as the author.",
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // skip CR
    } else {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => String(cell).trim() !== ""));
}

function rowsToObjects(rows) {
  if (!rows.length) return [];
  const headers = rows[0].map((h) => String(h).trim().toLowerCase());
  return rows.slice(1).map((cells) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cells[i] != null ? String(cells[i]).trim() : "";
    });
    return obj;
  });
}

function hostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function sheetUrl(sheetName) {
  const q = new URLSearchParams({
    tqx: "out:csv",
    sheet: sheetName,
    _: String(Date.now()),
  });
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${q}`;
}

async function fetchCsv(sheetName) {
  const res = await fetch(sheetUrl(sheetName), { cache: "no-store" });
  if (!res.ok) return null;
  const text = await res.text();
  if (!text || text.trimStart().startsWith("<") || text.includes("google.visualization.Query.setResponse")) {
    return null;
  }
  return rowsToObjects(parseCsv(text));
}

/**
 * @returns {Promise<object|null>} catalog shaped like catalog.json, or null
 */
export async function loadCatalog() {
  try {
    const [toolRows, catRows] = await Promise.all([
      fetchCsv("Tools"),
      fetchCsv("Categories"),
    ]);
    if (!toolRows || !catRows || !catRows.length) return null;

    const categories = catRows
      .filter((c) => c.id && c.name)
      .map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
      }));

    if (!categories.length) return null;

    const toolsByCat = new Map(categories.map((c) => [c.id, []]));
    let index = 0;

    for (const row of toolRows) {
      const category = row.category;
      if (!category || !toolsByCat.has(category)) continue;
      const name = row.name;
      const url = row.url;
      if (!name || !url) continue;
      index += 1;
      toolsByCat.get(category).push({
        id: row.id || name.replace(/\s+/g, ""),
        name,
        description: row.description || "",
        url,
        host: hostFromUrl(url),
        category,
        index,
      });
    }

    const groups = categories
      .map((category) => ({
        category: {
          id: category.id,
          name: category.name,
          description: category.description,
        },
        tools: toolsByCat.get(category.id) || [],
      }))
      .filter((g) => g.tools.length > 0);

    if (!groups.length) return null;

    const entries = groups.reduce((n, g) => n + g.tools.length, 0);

    return {
      site: SITE,
      about: ABOUT,
      description: `AI ToolBox lists ${entries} entries in ${groups.length} categories.`,
      stamp: `sheet-${Date.now().toString(16)}`,
      counts: { entries, categories: groups.length },
      groups,
    };
  } catch {
    return null;
  }
}
