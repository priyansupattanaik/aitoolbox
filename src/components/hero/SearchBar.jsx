import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

/**
 * @param {{
 *   query: string,
 *   setQuery: (q: string) => void
 * }} props
 */
export function SearchBar({ query, setQuery }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setQuery]);

  return (
    <div className="search-bar-shell">
      <div className="search-bar-inner">
        <Search size={18} className="search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          value={query}
          placeholder="Search by tool name, capability, category, or domain..."
          autoComplete="off"
          spellCheck="false"
          aria-label="Search tools"
          onChange={(e) => setQuery(e.target.value)}
        />
        {query ? (
          <button
            type="button"
            className="search-clear-btn"
            aria-label="Clear search query"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <X size={15} aria-hidden="true" />
          </button>
        ) : (
          <div className="search-shortcut-badge" aria-hidden="true">
            <kbd className="kbd-mini">/</kbd>
          </div>
        )}
      </div>
    </div>
  );
}
