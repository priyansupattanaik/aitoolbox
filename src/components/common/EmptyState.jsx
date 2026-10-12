import React from "react";
import { SearchX } from "lucide-react";

/**
 * @param {{
 *   query: string,
 *   onReset: () => void
 * }} props
 */
export function EmptyState({ query, onReset }) {
  return (
    <div className="empty-state-card" role="status">
      <div className="empty-icon-wrap">
        <SearchX size={26} aria-hidden="true" />
      </div>
      <h3>No tools found</h3>
      <p>
        {query
          ? `We couldn't find any tools matching “${query.trim()}”.`
          : "No tools available in this selected filter."}
      </p>
      <button type="button" className="reset-action-btn" onClick={onReset}>
        Reset search & filters
      </button>
    </div>
  );
}
