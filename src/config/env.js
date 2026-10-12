/**
 * Environment configuration reader with safe fallbacks.
 * Compatible with both Vite browser bundles and Node.js CLI execution.
 */
function readEnv(key, defaultValue = "") {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
      return String(import.meta.env[key]).trim();
    }
  } catch {
    // import.meta.env not accessible in certain environments
  }

  try {
    if (typeof process !== "undefined" && process.env && process.env[key]) {
      return String(process.env[key]).trim();
    }
  } catch {
    // process.env not accessible in browser
  }

  return defaultValue;
}

export const ENV = {
  SHEET_ID: readEnv("VITE_SHEET_ID", "1-IwOX6VT-09OXTnzturlks0VtvcRHtPrIIx58jCMfrM"),
  TOOLS_GID: readEnv("VITE_TOOLS_GID", "1104429197"),
  CATEGORIES_GID: readEnv("VITE_CATEGORIES_GID", "119010883"),
  SITE_TITLE: readEnv("VITE_SITE_TITLE", "AI ToolBox"),
  SITE_AUTHOR: readEnv("VITE_SITE_AUTHOR", "Priyansu Pattanaik"),
  GITHUB_REPO_URL: readEnv(
    "VITE_GITHUB_REPO_URL",
    "https://github.com/priyansupattanaik/aitoolbox"
  ),
};
