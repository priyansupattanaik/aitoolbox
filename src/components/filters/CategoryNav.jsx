import React from "react";

/** Category list: a sticky sidebar on wide screens, a scrollable chip row on small ones. */
export function CategoryNav({ categories, activeCategory, onSelectCategory, totalTools }) {
  const items = [{ id: "all", name: "All tools", count: totalTools }, ...categories];
  return (
    <nav className="category-nav" aria-label="Categories">
      <p className="category-nav-title">Categories</p>
      <ul className="category-list">
        {items.map((c) => {
          const active = c.id === activeCategory;
          return (
            <li key={c.id}>
              <button
                type="button"
                className={`category-item${active ? " is-active" : ""}`}
                aria-pressed={active}
                onClick={() => onSelectCategory(c.id)}
                title={c.description || c.name}
              >
                <span className="category-name">{c.name}</span>
                <span className="category-count">{c.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
