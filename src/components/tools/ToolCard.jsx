import React from "react";
import { ArrowUpRight } from "lucide-react";
import { SheetIcon } from "../common/SheetIcon.jsx";

/**
 * @param {{
 *   tool: {
 *     id: string,
 *     name: string,
 *     description?: string,
 *     url?: string,
 *     href?: string|null,
 *     host?: string,
 *     categoryName?: string,
 *     icon?: string,
 *     added?: string,
 *     index?: number
 *   },
 *   domId?: string,
 *   isHovered?: boolean,
 *   isDimmed?: boolean,
 *   onMouseEnter?: (e: React.PointerEvent) => void,
 *   onMouseLeave?: (e: React.PointerEvent) => void,
 *   onFocus?: () => void,
 *   onBlur?: () => void
 * }} props
 */
function ToolCardComponent({
  tool,
  domId,
  isHovered = false,
  isDimmed = false,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}) {
  const cardContent = (
    <div className="tool-card-inner">
      <div className="tool-card-head">
        <div className="tool-avatar-shell">
          <SheetIcon name={tool.icon} size={20} />
        </div>

        <div className="tool-meta-block">
          <div className="tool-title-row">
            <h3 className="tool-name">{tool.name}</h3>
            {tool.categoryName && (
              <span className="tool-category-badge">{tool.categoryName}</span>
            )}
          </div>
          {tool.host && (
            <span className="tool-host-label">{tool.host}</span>
          )}
        </div>

        {tool.href && (
          <div className="tool-action-circle" aria-hidden="true">
            <ArrowUpRight size={15} className="tool-action-arrow" />
          </div>
        )}
      </div>

      {tool.description && (
        <p className="tool-card-description">{tool.description}</p>
      )}

      {tool.href && <span className="sr-only">Opens external website for {tool.name} in a new tab</span>}
    </div>
  );

  const cardClasses = [
    "tool-card",
    isHovered ? "is-focused" : "",
    isDimmed ? "is-dimmed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const elementId = domId || `tool-${tool.id}`;

  if (tool.href) {
    return (
      <a
        id={elementId}
        href={tool.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
        data-focused={isHovered ? "true" : undefined}
        data-dimmed={isDimmed ? "true" : undefined}
        onPointerEnter={onMouseEnter}
        onPointerLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div
      id={elementId}
      tabIndex={0}
      className={cardClasses}
      data-focused={isHovered ? "true" : undefined}
      data-dimmed={isDimmed ? "true" : undefined}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {cardContent}
    </div>
  );
}

export const ToolCard = React.memo(ToolCardComponent);
