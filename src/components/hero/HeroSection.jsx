import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles, AlertTriangle, RefreshCw } from "lucide-react";
import { SearchBar } from "./SearchBar.jsx";

/**
 * @param {{
 *   query: string,
 *   setQuery: (q: string) => void,
 *   isFallback: boolean,
 *   totalTools: number,
 *   error?: string|null,
 *   onRetry: () => void
 * }} props
 */
export function HeroSection({ query, setQuery, isFallback, totalTools, error, onRetry }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero-section">
      <motion.div
        className="hero-badge"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <Sparkles size={13} className="hero-badge-sparkle" aria-hidden="true" />
        <span>Curated Directory &bull; {totalTools} Hand-Picked Tools</span>
      </motion.div>

      <motion.h1
        className="hero-title"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
      >
        Every tool you need to build with AI.
      </motion.h1>

      <motion.p
        className="hero-lede"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      >
        A precision index of artificial intelligence platforms, developer utilities, and generative models, synchronized live from the catalog spreadsheet.
      </motion.p>

      {isFallback && (
        <motion.div
          className="fallback-alert-banner"
          role="status"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="alert-content">
            <AlertTriangle size={16} className="alert-icon" aria-hidden="true" />
            <span>
              {error
                ? `Sync notice: ${error}. Showing verified offline catalog.`
                : "Operating in cached fallback mode. Google Sheets sync is currently offline."}
            </span>
          </div>
          <button type="button" className="retry-btn" onClick={onRetry} aria-label="Retry live sync">
            <RefreshCw size={13} aria-hidden="true" />
            <span>Retry Sync</span>
          </button>
        </motion.div>
      )}

      <motion.div
        className="hero-search-wrapper"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      >
        <SearchBar query={query} setQuery={setQuery} />
      </motion.div>
    </section>
  );
}
