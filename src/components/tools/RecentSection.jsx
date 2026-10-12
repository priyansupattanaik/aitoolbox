import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { formatSheetDate } from "../../utils/formatters.js";
import { ToolCard } from "./ToolCard.jsx";

/**
 * @param {{
 *   recent: { date: string, tools: Array<any> },
 *   hoveredId: string|null,
 *   hasSpotlight: boolean,
 *   onMouseEnter: (id: string, e: React.PointerEvent) => void,
 *   onMouseLeave: () => void,
 *   onFocus: (id: string) => void,
 *   onBlur: () => void
 * }} props
 */
export function RecentSection({
  recent,
  hoveredId,
  hasSpotlight,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}) {
  const reduceMotion = useReducedMotion();

  if (!recent || !recent.tools || recent.tools.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="recent-section"
      aria-labelledby="recent-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="recent-header">
        <div className="recent-badge" id="recent-heading">
          <Sparkles size={12} aria-hidden="true" />
          <span>Recently Added</span>
        </div>
        <p className="recent-meta-sub">
          {recent.tools.length} {recent.tools.length === 1 ? "tool" : "tools"} added on {formatSheetDate(recent.date)}
        </p>
      </div>

      <div className="recent-grid">
        {recent.tools.map((tool) => (
          <ToolCard
            key={`recent-${tool.index}-${tool.id}`}
            tool={tool}
            domId={`recent-tool-${tool.id}`}
            isHovered={hoveredId === `recent-${tool.id}` || hoveredId === tool.id}
            isDimmed={hasSpotlight && hoveredId !== `recent-${tool.id}` && hoveredId !== tool.id}
            onMouseEnter={(e) => onMouseEnter(`recent-${tool.id}`, e)}
            onMouseLeave={onMouseLeave}
            onFocus={() => onFocus(`recent-${tool.id}`)}
            onBlur={onBlur}
          />
        ))}
      </div>
    </motion.section>
  );
}
