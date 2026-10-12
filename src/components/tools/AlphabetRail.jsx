import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * @param {{
 *   sections: Array<{ key: string, tools: Array<any> }>,
 *   currentLetter: string,
 *   onSelectLetter: (key: string) => void
 * }} props
 */
export function AlphabetRail({ sections, currentLetter, onSelectLetter }) {
  const reduceMotion = useReducedMotion();
  const railRef = useRef(null);

  useEffect(() => {
    if (!railRef.current || !currentLetter) return;
    const button = railRef.current.querySelector(`[data-letter="${CSS.escape(currentLetter)}"]`);
    if (!button || railRef.current.matches(":hover")) return;

    const railBox = railRef.current.getBoundingClientRect();
    const buttonBox = button.getBoundingClientRect();
    if (buttonBox.top >= railBox.top && buttonBox.bottom <= railBox.bottom) return;

    const top = button.offsetTop - railRef.current.clientHeight / 2 + button.clientHeight / 2;
    railRef.current.scrollTo({ top, behavior: "auto" });
  }, [currentLetter, sections]);

  if (sections.length <= 1) return null;

  return (
    <nav
      ref={railRef}
      className="index-rail"
      aria-label="Alphabetical quick jump"
    >
      <div className="index-rail-inner">
        {sections.map((section) => {
          const isSelected = currentLetter === section.key;
          const jump = () => onSelectLetter(section.key);

          return (
            <button
              key={section.key}
              type="button"
              data-letter={section.key}
              className={`index-letter-btn ${isSelected ? "is-current" : ""}`}
              aria-current={isSelected ? "true" : undefined}
              aria-label={
                section.key === "#"
                  ? "Scroll to non-alphabetical tools"
                  : `Scroll to ${section.key}`
              }
              onClick={jump}
              onKeyDown={(event) => {
                if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                event.stopPropagation();
                const keys = sections.map((s) => s.key);
                const idx = keys.indexOf(section.key);
                let nextIdx = idx;
                if (event.key === "ArrowDown") nextIdx = Math.min(keys.length - 1, idx + 1);
                if (event.key === "ArrowUp") nextIdx = Math.max(0, idx - 1);
                if (event.key === "Home") nextIdx = 0;
                if (event.key === "End") nextIdx = keys.length - 1;
                const nextKey = keys[nextIdx];
                railRef.current
                  ?.querySelector(`[data-letter="${CSS.escape(nextKey)}"]`)
                  ?.focus({ preventScroll: true });
              }}
            >
              {isSelected && (
                reduceMotion ? (
                  <span className="index-mark-pill" />
                ) : (
                  <motion.span
                    className="index-mark-pill"
                    layoutId="index-active-mark"
                    transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                  />
                )
              )}
              <span className="index-letter-text">{section.key}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
