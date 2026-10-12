import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { SearchBar } from "./SearchBar.jsx";

/**
 * @param {{
 *   query: string,
 *   setQuery: (q: string) => void,
 *   totalTools: number,
 * }} props
 */
export function HeroSection({ query, setQuery, totalTools }) {
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
