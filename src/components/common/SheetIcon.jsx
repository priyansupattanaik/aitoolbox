import React from "react";
import { resolveIcon } from "../../utils/icons.js";

/**
 * Renders a tool icon based on spreadsheet name with graceful Sparkles fallback.
 *
 * @param {{ name?: string, size?: number, className?: string }} props
 */
export function SheetIcon({ name, size = 18, className = "" }) {
  const IconComponent = resolveIcon(name);

  return (
    <span className={`tool-icon ${className}`.trim()} aria-hidden="true">
      <IconComponent size={size} />
    </span>
  );
}
