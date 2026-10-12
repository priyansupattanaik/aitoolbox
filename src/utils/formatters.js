const NAME_SORT_OPTIONS = { sensitivity: "base", numeric: true };

/**
 * Validates whether a string is a valid YYYY-MM-DD date.
 *
 * @param {string} value
 * @returns {string} The valid ISO date or empty string
 */
export function validateIsoDate(value) {
  if (!value || typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return "";
  }
  const [year, month, day] = value.trim().split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return "";
  }
  return value.trim();
}

/**
 * Formats an ISO YYYY-MM-DD date string into a localized human-readable string.
 *
 * @param {string} iso
 * @returns {string}
 */
export function formatSheetDate(iso) {
  if (!iso || typeof iso !== "string") return "";
  try {
    const valid = validateIsoDate(iso);
    if (!valid) return "";
    const [year, month, day] = valid.split("-").map(Number);
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  } catch {
    return "";
  }
}

/**
 * Natural language comparison for tool names.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function compareNames(a = "", b = "") {
  return String(a).localeCompare(String(b), "en", NAME_SORT_OPTIONS);
}

/**
 * Extracts the single uppercase initial key for grouping (A-Z, or # for numbers/symbols).
 *
 * @param {string} name
 * @returns {string}
 */
export function sectionKey(name = "") {
  const char = String(name).trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(char) ? char : "#";
}

/**
 * Formats count with singular or plural noun.
 *
 * @param {number} count
 * @param {string} singular
 * @param {string} pluralForm
 * @returns {string}
 */
export function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
