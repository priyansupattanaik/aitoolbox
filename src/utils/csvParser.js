/**
 * RFC 4180 compliant CSV parser.
 * Handles multiline cells, escaped quotes, Windows/Unix CRLF, and UTF-8 BOM.
 *
 * @param {string} text Raw CSV text
 * @returns {string[][]} 2D array of rows and cells
 */
export function parseCsv(text) {
  if (typeof text !== "string" || !text.trim()) return [];

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
    } else if (ch !== "\r") {
      field += ch;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => String(cell).trim() !== ""));
}

/**
 * Converts parsed CSV rows into an array of normalized objects based on the first row's headers.
 *
 * @param {string[][]} rows
 * @returns {Record<string, string>[]}
 */
export function rowsToObjects(rows) {
  if (!Array.isArray(rows) || rows.length < 2) return [];

  const headers = rows[0].map((header) => String(header || "").trim().toLowerCase());

  return rows.slice(1).map((cells) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = cells[index] != null ? String(cells[index]).trim() : "";
    });
    return obj;
  });
}
