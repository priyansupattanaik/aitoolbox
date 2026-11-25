import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { ToolCard } from "./ToolCard.jsx";
import { recentlyAdded } from "../../utils/summary.js";

/** "Recently added": the 5 newest tools by date added. */
export function RecentlyAdded({ tools }) {
  const recent = useMemo(() => recentlyAdded(tools, 5), [tools]);
  if (!recent.length) return null;
  return (
    <section className="recent-section" aria-labelledby="recent-title">
      <h2 id="recent-title" className="recent-title">
        <Clock size={15} aria-hidden="true" />
        Recently added
      </h2>
      <div className="tools-grid recent-grid">
        {recent.map((tool) => (
          <ToolCard key={`recent-${tool.index}-${tool.id}`} tool={tool} domId={`recent-tool-${tool.index}`} />
        ))}
      </div>
    </section>
  );
}
