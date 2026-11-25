import React from "react";
import { ArrowUpRight } from "lucide-react";
import { SheetIcon } from "../common/SheetIcon.jsx";
import { formatSheetDate } from "../../utils/formatters.js";
import { cardSummary } from "../../utils/summary.js";

/**
 * One tool in the directory. The description is a single short line
 * (the sheet's short_description, falling back to the full description).
 *
 * @param {{
 *   tool: {
 *     id: string,
 *     name: string,
 *     shortDescription?: string,
 *     description?: string,
 *     href?: string|null,
 *     host?: string,
 *     categoryName?: string,
 *     icon?: string,
 *     added?: string,
 *     source?: string,
 *     github?: string,
 *     index?: number
 *   },
 *   domId?: string,
 *   reason?: string
 * }} props
 */
function ToolCardComponent({ tool, domId, reason }) {
  const summary = cardSummary(tool);
  const elementId = domId || `tool-${tool.id}`;

  const content = (
    <div className="tool-card-inner">
      <div className="tool-card-head">
        <div className="tool-avatar-shell">
          <SheetIcon name={tool.icon} size={18} />
        </div>
        <div className="tool-meta-block">
          <h3 className="tool-name">{tool.name}</h3>
          {tool.host && <span className="tool-host-label">{tool.host}</span>}
        </div>
        {tool.href && (
          <span className="tool-action-circle" aria-hidden="true">
            <ArrowUpRight size={15} />
          </span>
        )}
      </div>

      {summary && <p className="tool-card-description">{summary}</p>}

      {reason && (
        <p className="tool-card-reason">
          <span className="sr-only">Why it fits: </span>
          {reason}
        </p>
      )}

      <div className="tool-card-foot">
        {tool.categoryName && <span className="tool-tag">{tool.categoryName}</span>}
        {tool.source && <span className="tool-tag is-muted">via {tool.source}</span>}
        {tool.github && <span className="tool-tag is-github">GitHub repo</span>}
        {tool.added && <time className="tool-date" dateTime={tool.added}>{formatSheetDate(tool.added)}</time>}
      </div>

      {tool.href && <span className="sr-only">Opens external website for {tool.name} in a new tab</span>}
    </div>
  );

  if (tool.href) {
    return (
      <a id={elementId} href={tool.href} target="_blank" rel="noopener noreferrer" className="tool-card">
        {content}
      </a>
    );
  }
  return (
    <div id={elementId} className="tool-card">
      {content}
    </div>
  );
}

export const ToolCard = React.memo(ToolCardComponent);
