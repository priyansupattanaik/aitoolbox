import { useMemo } from "react";
import { tools } from "../data/tools";

export const useToolSearch = (query: string) => {
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerCaseQuery = query.toLowerCase();
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerCaseQuery) ||
        tool.description.toLowerCase().includes(lowerCaseQuery) ||
        tool.category.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query]);

  return { searchResults };
};
