import React from "react";
import { SITE_CONFIG } from "../../config/site.js";

export function Header({ totalTools, totalCategories, onBrandClick }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="brand" onClick={(e) => { e.preventDefault(); onBrandClick(); }}>
          <img src="/favicon.svg" alt="" width="28" height="28" />
          <span>AI ToolBox</span>
        </a>
        <div className="header-meta">
          <span className="header-stat"><strong>{totalTools}</strong> tools</span>
          <span className="header-stat"><strong>{totalCategories}</strong> categories</span>
          {SITE_CONFIG.githubUrl && (
            <a className="header-link" href={SITE_CONFIG.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
          )}
        </div>
      </div>
    </header>
  );
}
