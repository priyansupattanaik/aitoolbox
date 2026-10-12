/**
 * Public, non-sensitive build settings. The spreadsheet id is NOT here:
 * it lives only in the Netlify Function (env SHEET_ID).
 */
function readEnv(key, defaultValue = "") {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
      return String(import.meta.env[key]).trim();
    }
  } catch {
    // not available
  }
  return defaultValue;
}

export const ENV = {
  SITE_TITLE: readEnv("VITE_SITE_TITLE", "AI ToolBox"),
  SITE_AUTHOR: readEnv("VITE_SITE_AUTHOR", "Priyansu Pattanaik"),
  GITHUB_REPO_URL: readEnv("VITE_GITHUB_REPO_URL", "https://github.com/priyansupattanaik/aitoolbox"),
};
