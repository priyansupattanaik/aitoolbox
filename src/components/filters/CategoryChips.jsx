import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * @param {{
 *   categories: Array<{ id: string, name: string, count: number, description?: string }>,
 *   activeCategory: string,
 *   onSelectCategory: (id: string) => void,
 *   activeCategoryMeta?: { name: string, description?: string }
 * }} props
 */
export function CategoryChips({
  categories,
  activeCategory,
  onSelectCategory,
  activeCategoryMeta,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="filter-chips-container" role="region" aria-label="Tool Categories">
      <div className="chips-rail" role="tablist">
        <button
          type="button"
          role="tab"
          className="filter-chip"
          aria-selected={activeCategory === "all"}
          onClick={() => onSelectCategory("all")}
        >
          {activeCategory === "all" && (
            reduceMotion ? (
              <span className="chip-active-backdrop" />
            ) : (
              <motion.span
                className="chip-active-backdrop"
                layoutId="category-pill"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )
          )}
          <span className="chip-label-text">All Categories</span>
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              className="filter-chip"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.id)}
            >
              {isActive && (
                reduceMotion ? (
                  <span className="chip-active-backdrop" />
                ) : (
                  <motion.span
                    className="chip-active-backdrop"
                    layoutId="category-pill"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )
              )}
              <span className="chip-label-text">{cat.name}</span>
              <span className="chip-count-tag">{cat.count}</span>
            </button>
          );
        })}
      </div>

      {activeCategoryMeta?.description && (
        <p className="active-category-description">
          {activeCategoryMeta.description}
        </p>
      )}
    </div>
  );
}
