
import { useState, useEffect, useMemo } from "react";
import { Tool, tools } from "../data/tools";

export const useToolSearch = (query: string) => {
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Basic search implementation
  const performSearch = useMemo(() => {
    return (searchQuery: string) => {
      if (!searchQuery.trim()) {
        return tools;
      }
      
      const lowerCaseQuery = searchQuery.toLowerCase();
      
      return tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(lowerCaseQuery) ||
          tool.description.toLowerCase().includes(lowerCaseQuery) ||
          tool.category.toLowerCase().includes(lowerCaseQuery)
      );
    };
  }, []);
  
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API delay
    const timeoutId = setTimeout(() => {
      const results = performSearch(query);
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);
  
  return { searchResults, isLoading };
};
