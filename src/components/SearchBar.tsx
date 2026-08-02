import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import { useToolSearch } from "../hooks/useToolSearch";
import { Tool } from "../data/tools";

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-accent/20 text-accent rounded px-0.5 font-medium">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
};

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { searchResults } = useToolSearch(query);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setShowResults(false);
    setActiveIndex(-1);
  }, []);

  const handleToolClick = useCallback(
    (url: string) => {
      window.open(url, "_blank", "noopener,noreferrer");
      setQuery("");
      close();
    },
    [close]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || searchResults.length === 0) {
      if (e.key === "Escape") {
        close();
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < searchResults.length) {
          handleToolClick(searchResults[activeIndex].url);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
    }
  };

  const showDropdown = showResults && query.trim() !== "";

  return (
    <div ref={searchRef} className="relative w-full group">
      <div className="relative" role="combobox" aria-expanded={showDropdown} aria-haspopup="listbox">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => query.trim() && setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for AI tools..."
          className="w-full h-12 pl-12 pr-12 rounded-2xl
                    bg-background/60 backdrop-blur-sm border-2 border-border
                    focus:border-accent/50 focus:ring-4 focus:ring-accent/10
                    outline-none transition-all duration-300
                    placeholder:text-foreground/30 text-foreground
                    dark:bg-secondary/10"
          aria-label="Search AI tools"
          aria-autocomplete="list"
          role="searchbox"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground pointer-events-none">
          <Search size={18} className="group-focus-within:text-accent transition-colors" />
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground/50 hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute mt-2 w-full bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl z-50 max-h-[70vh] overflow-hidden animate-scale-in origin-top" role="listbox">
          {searchResults.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-foreground/50">
                No tools found for <span className="text-foreground font-medium">&ldquo;{query}&rdquo;</span>
              </p>
              <p className="text-xs text-foreground/40 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2 text-xs text-foreground/40 font-medium">
                <span>Results ({searchResults.length})</span>
                <span className="flex items-center gap-2">
                  <ArrowUp size={12} /> <ArrowDown size={12} /> navigate
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1 pb-1" id="search-results">
                {searchResults.map((tool: Tool, index: number) => (
                  <div
                    key={tool.id}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                      index === activeIndex
                        ? "bg-accent/15 text-accent shadow-sm"
                        : "hover:bg-accent/5"
                    }`}
                    onClick={() => handleToolClick(tool.url)}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm">
                        <Highlight text={tool.name} query={query} />
                      </div>
                      <div className="text-xs text-foreground/50 truncate mt-0.5">
                        <Highlight text={tool.description} query={query} />
                      </div>
                    </div>
                    <ExternalLink size={14} className="flex-shrink-0 ml-3 text-foreground/30" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
