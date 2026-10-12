import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Shown when the Google Sheet cannot be loaded. The sheet is the only data
 * source, so nothing else is rendered in its place.
 *
 * @param {{ message?: string|null, onRetry: () => void }} props
 */
export function CatalogError({ message, onRetry }) {
  return (
    <div className="loading-view" role="alert">
      <div className="loading-card catalog-error-card">
        <AlertTriangle size={28} className="alert-icon" aria-hidden="true" />
        <div className="loading-text">
          <div className="loading-title">Catalog unavailable</div>
          <div className="loading-sub">
            {message || "Could not load the catalog from Google Sheets."} Check your connection and try again.
          </div>
        </div>
        <button type="button" className="retry-btn" onClick={onRetry}>
          <RefreshCw size={13} aria-hidden="true" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
}
