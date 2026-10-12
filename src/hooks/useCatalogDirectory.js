import { useEffect, useMemo, useState } from "react";
import { compareNames, sectionKey } from "../utils/formatters.js";
import { hostFromUrl, safeHttpUrl } from "../utils/url.js";

/**
 * Custom hook for directory filtering, search querying, and categorization.
 *
 * @param {object|null} catalog
 */
export function useCatalogDirectory(catalog) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Synchronize category with URL hash
  useEffect(() => {
    if (!catalog?.groups) return undefined;

    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const isKnown = catalog.groups.some((group) => group.category.id === hash);
      setActiveCategory(isKnown ? hash : "all");
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [catalog]);

  const selectCategory = (catId) => {
    const next = catId || "all";
    setActiveCategory(next);
    if (next === "all") {
      const path = window.location.pathname + window.location.search;
      window.history.pushState(null, "", path);
    } else {
      window.location.hash = next;
    }
  };

  // Normalized list of categories with tool counts
  const categories = useMemo(() => {
    if (!catalog?.groups) return [];
    return catalog.groups
      .map((group) => ({
        id: group.category.id,
        name: group.category.name,
        description: group.category.description || "",
        count: group.tools.length,
      }))
      .sort((a, b) => compareNames(a.name, b.name));
  }, [catalog]);

  // Flattened and normalized tool list
  const allTools = useMemo(() => {
    if (!catalog?.groups) return [];
    const list = [];
    for (const group of catalog.groups) {
      for (const tool of group.tools) {
        const href = safeHttpUrl(tool.url);
        list.push({
          ...tool,
          categoryName: group.category.name,
          href,
          host: tool.host || (href ? hostFromUrl(href) : ""),
          added: tool.added || "",
        });
      }
    }
    list.sort((a, b) => compareNames(a.name, b.name) || a.index - b.index);
    return list;
  }, [catalog]);

  const sanitizedQuery = query.trim().toLowerCase();

  // Filtered tools based on active category and search query
  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      if (activeCategory !== "all" && tool.category !== activeCategory) {
        return false;
      }
      if (!sanitizedQuery) return true;
      const haystack = `${tool.name} ${tool.description} ${tool.host} ${tool.categoryName}`.toLowerCase();
      return haystack.includes(sanitizedQuery);
    });
  }, [allTools, activeCategory, sanitizedQuery]);

  // Extract recently added tools (if dated)
  const recent = useMemo(() => {
    const dated = allTools.filter((tool) => tool.added);
    if (!dated.length) return { date: "", tools: [] };

    const newest = dated.reduce((max, tool) => (tool.added > max ? tool.added : max), "");
    if (!dated.some((tool) => tool.added < newest)) return { date: "", tools: [] };

    const tools = dated
      .filter((tool) => tool.added === newest)
      .filter((tool) => activeCategory === "all" || tool.category === activeCategory)
      .filter((tool) => {
        if (!sanitizedQuery) return true;
        const haystack = `${tool.name} ${tool.description} ${tool.host} ${tool.categoryName}`.toLowerCase();
        return haystack.includes(sanitizedQuery);
      })
      .sort((a, b) => compareNames(a.name, b.name) || a.index - b.index);

    return { date: newest, tools };
  }, [allTools, activeCategory, sanitizedQuery]);

  // Group filtered tools alphabetically into letter sections
  const sections = useMemo(() => {
    const grouped = [];
    for (const tool of filteredTools) {
      const key = sectionKey(tool.name);
      const last = grouped[grouped.length - 1];
      if (!last || last.key !== key) {
        grouped.push({ key, tools: [tool] });
      } else {
        last.tools.push(tool);
      }
    }
    return grouped;
  }, [filteredTools]);

  const activeCategoryMeta = categories.find((c) => c.id === activeCategory);

  return {
    query,
    setQuery,
    activeCategory,
    selectCategory,
    categories,
    activeCategoryMeta,
    allTools,
    filteredTools,
    recent,
    sections,
  };
}
