
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useToolSearch } from "../hooks/useToolSearch";
import { Tool } from "../data/tools";

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { searchResults, isLoading } = useToolSearch(query);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
    setShowResults(true);
  };
  
  const handleToolClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setShowResults(false);
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);
  
  return (
    <div ref={searchRef} className="relative w-full group">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for AI tools..."
          className="w-full h-12 pl-12 pr-4 rounded-xl 
                    bg-background border border-border
                    focus:border-accent focus:ring-1 focus:ring-accent 
                    outline-none transition duration-200
                    dark:bg-secondary/20 glass"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
          <Search size={18} />
        </div>
      </form>
      
      {/* Search results dropdown */}
      {showResults && query.trim() !== "" && (
        <div className="absolute mt-2 w-full bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-lg z-50 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No tools found matching "{query}"
            </div>
          ) : (
            <div className="p-2">
              <div className="text-sm font-medium text-foreground/70 p-2">
                Search Results ({searchResults.length})
              </div>
              <div className="space-y-2">
                {searchResults.map((tool: Tool) => (
                  <div 
                    key={tool.id} 
                    className="p-2 hover:bg-accent/10 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => handleToolClick(tool.url)}
                  >
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-sm text-foreground/70 line-clamp-1">{tool.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="absolute inset-0 rounded-xl sci-fi-border opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};
