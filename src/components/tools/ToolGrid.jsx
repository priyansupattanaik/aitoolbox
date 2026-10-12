import React from "react";
import { ToolCard } from "./ToolCard.jsx";

/**
 * @param {{
 *   sections: Array<{ key: string, tools: Array<any> }>,
 *   currentLetter: string,
 *   hoveredId: string|null,
 *   hasSpotlight: boolean,
 *   onMouseEnter: (id: string, e: React.PointerEvent) => void,
 *   onMouseLeave: () => void,
 *   onFocus: (id: string) => void,
 *   onBlur: () => void
 * }} props
 */
export function ToolGrid({
  sections,
  currentLetter,
  hoveredId,
  hasSpotlight,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}) {
  return (
    <div className="directory-container" id="tools-directory">
      {sections.map((section) => {
        const isCurrent = currentLetter === section.key;
        return (
          <section
            key={section.key}
            id={`letter-${section.key}`}
            className={`letter-group ${isCurrent ? "is-active-letter" : ""}`}
            aria-labelledby={`heading-${section.key}`}
          >
            <div className="letter-header-sticky">
              <div className="letter-indicator">
                <span className="letter-char" id={`heading-${section.key}`}>
                  {section.key}
                </span>
                <span className="letter-count">
                  {section.tools.length} {section.tools.length === 1 ? "tool" : "tools"}
                </span>
              </div>
              <div className="letter-divider-line" aria-hidden="true" />
            </div>

            <div className="tools-cards-grid">
              {section.tools.map((tool) => (
                <ToolCard
                  key={`${tool.index}-${tool.id}`}
                  tool={tool}
                  domId={`tool-${tool.id}`}
                  isHovered={hoveredId === tool.id || hoveredId === `recent-${tool.id}`}
                  isDimmed={hasSpotlight && hoveredId !== tool.id && hoveredId !== `recent-${tool.id}`}
                  onMouseEnter={(e) => onMouseEnter(tool.id, e)}
                  onMouseLeave={onMouseLeave}
                  onFocus={() => onFocus(tool.id)}
                  onBlur={onBlur}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
