import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { SheetIcon } from "../common/SheetIcon.jsx";
import { formatSheetDate } from "../../utils/formatters.js";

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
 *     source?: string,
 *     sourceUrl?: string,
 *     sourceScreenshot?: string,
 *     sourceNote?: string,
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
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const PREVIEW_WIDTH = 320;

function useFinePointer() {
  const [fine, setFine] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(FINE_POINTER_QUERY).matches
  );
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mql = window.matchMedia(FINE_POINTER_QUERY);
    const onChange = () => setFine(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return fine;
}

/**
 * Preview of where a tool was found: screenshot, platform label and a link
 * to the source page. Every value comes from the sheet row.
 */
function SourcePreview({ tool, side, previewId }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const label = tool.source || "Source";

  return (
    <aside
      id={previewId}
      className={`tool-source-preview is-${side}`}
      aria-label={`Where ${tool.name} was found`}
    >
      <div className="tool-source-shot">
        {tool.sourceScreenshot && !failed ? (
          <img
            src={tool.sourceScreenshot}
            alt={`Screenshot of the ${label} page where ${tool.name} was found`}
            loading="lazy"
            decoding="async"
            className={loaded ? "is-loaded" : ""}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="tool-source-shot-fallback">
            <ImageOff size={20} aria-hidden="true" />
            <span>Screenshot unavailable</span>
          </div>
        )}
      </div>
      <div className="tool-source-meta">
        <span className="tool-category-badge">Found on {label}</span>
        {tool.sourceUrl && (
          <a
            className="tool-source-link"
            href={tool.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View source <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
      </div>
      {tool.sourceNote && <p className="tool-source-note">{tool.sourceNote}</p>}
    </aside>
  );
}

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

      {tool.description && <p className="tool-card-description">{tool.description}</p>}

      <div className="tool-card-foot">
        {tool.categoryName && <span className="tool-tag">{tool.categoryName}</span>}
        {tool.source && <span className="tool-tag is-muted" title="Where this tool was found">via {tool.source}</span>}
        {tool.github && <span className="tool-tag is-github" title="Has a GitHub repository">GitHub repo</span>}
        {tool.added && <time className="tool-date" dateTime={tool.added}>{formatSheetDate(tool.added)}</time>}
      </div>

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
  const previewId = `${elementId}-source`;
  const wrapRef = useRef(null);
  const finePointer = useFinePointer();
  const [side, setSide] = useState("right");
  const hasSource = Boolean(tool.sourceUrl || tool.sourceScreenshot);
  const showPreview = isHovered && finePointer && hasSource;

  useEffect(() => {
    if (!showPreview || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const fitsRight = rect.right + 12 + PREVIEW_WIDTH <= window.innerWidth;
    const fitsLeft = rect.left - 12 - PREVIEW_WIDTH >= 0;
    setSide(fitsRight || !fitsLeft ? "right" : "left");
  }, [showPreview]);

  const handleBlur = (event) => {
    if (wrapRef.current && wrapRef.current.contains(event.relatedTarget)) return;
    onBlur?.(event);
  };

  return (
    <div
      ref={wrapRef}
      className={`tool-card-wrap${showPreview ? " has-preview" : ""}`}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={handleBlur}
    >
      {renderCard()}
      {showPreview && <SourcePreview tool={tool} side={side} previewId={previewId} />}
    </div>
  );

  function renderCard() {
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
        aria-describedby={showPreview ? previewId : undefined}
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
      aria-describedby={showPreview ? previewId : undefined}
    >
      {cardContent}
    </div>
  );
  }
}

export const ToolCard = React.memo(ToolCardComponent);
