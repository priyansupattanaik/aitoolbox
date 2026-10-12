import { ENV } from "./env.js";

/**
 * Site metadata and branding defaults
 */
export const SITE_CONFIG = {
  title: ENV.SITE_TITLE,
  author: ENV.SITE_AUTHOR,
  language: "en",
  githubUrl: ENV.GITHUB_REPO_URL,
  description: "Curated catalog of cutting-edge AI tools, directories, and engineering resources.",
  themeColor: "#000000",
};
