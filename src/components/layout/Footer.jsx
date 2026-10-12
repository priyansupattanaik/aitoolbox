import React from "react";
import { SITE_CONFIG } from "../../config/site.js";

/**
 * @param {{
 *   totalTools: number,
 *   totalCategories: number,
 *   source: string
 * }} props
 */
export function Footer({ totalTools, totalCategories, source }) {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-meta">
          <p className="footer-title">
            {SITE_CONFIG.title} — {totalTools} resources across {totalCategories} categories.
          </p>
          <p className="footer-curation">
            Curated and maintained by <strong>{SITE_CONFIG.author}</strong>.
            {source === "spreadsheet" ? " Connected directly to live spreadsheet." : " Loaded from local fallback store."}
          </p>
        </div>
        <div className="footer-shortcuts">
          <span className="shortcut-pill">
            <kbd className="kbd-key">/</kbd> to search
          </span>
          <span className="shortcut-pill">
            <kbd className="kbd-key">Esc</kbd> to clear
          </span>
        </div>
      </div>
    </footer>
  );
}
