/**
 * Validates and normalizes an HTTP/HTTPS URL.
 * Rejects non-HTTP schemes (javascript:, data:, etc.) to prevent security issues.
 *
 * @param {string} url
 * @returns {string|null} Safe normalized URL or null if invalid
 */
export function safeHttpUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch {
    // Malformed URL
  }
  return null;
}

/**
 * Extracts a clean hostname without leading 'www.' from a URL string.
 *
 * @param {string} url
 * @returns {string} Clean hostname or empty string if invalid
 */
export function hostFromUrl(url) {
  if (!url || typeof url !== "string") return "";
  try {
    return new URL(url.trim()).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}
