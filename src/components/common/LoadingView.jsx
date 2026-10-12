import React from "react";
import { motion, useReducedMotion } from "motion/react";

export function LoadingView() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="loading-view" role="status" aria-live="polite">
      <motion.div
        className="loading-card"
        initial={reduceMotion ? false : { opacity: 0.4, scale: 0.98 }}
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: [0.4, 1, 0.4], scale: [0.98, 1, 0.98] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }
        }
      >
        <div className="loading-indicator">
          <img src="/favicon.svg" alt="" width="36" height="36" />
          <span className="loading-ping" />
        </div>
        <div className="loading-text">
          <div className="loading-title">Connecting to live catalog</div>
          <div className="loading-sub">Fetching directory records from Google Sheets...</div>
        </div>
      </motion.div>
    </div>
  );
}
