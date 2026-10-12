import { useEffect, useMemo, useState } from "react";
import { compareNames } from "../utils/formatters.js";
import { hostFromUrl, safeHttpUrl } from "../utils/url.js";
import { DEFAULT_SORT, isSortId, sortTools } from "../utils/sort.js";

function readSortFromUrl() {
  if (typeof window === "undefined") return DEFAULT_SORT;
  const value = new URLSearchParams(window.location.search).get("sort");
  return isSortId(value) ? value : DEFAULT_SORT;
}

/**
 * Filtering (category + search) and sorting for the directory.
 * Category is kept in the URL hash and the sort in ?sort= so views are shareable.
 *
 * @param {object|null} catalog
 */
export function useCatalogDirectory(catalog) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortId, setSortIdState] = useState(readSortFromUrl);

  useEffect(() => {
    if (!catalog?.groups) return undefined;
    const handleHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
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
    const base = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", next === "all" ? base : `${base}#${encodeURIComponent(next)}`);
  };

  const setSortId = (id) => {
    const next = isSortId(id) ? id : DEFAULT_SORT;
    setSortIdState(next);
    const params = new URLSearchParams(window.location.search);
    if (next === DEFAULT_SORT) params.delete("sort");
    else params.set("sort", next);
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
  };

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
          github: tool.github || "",
        });
      }
    }
    return list;
  }, [catalog]);

  const sanitizedQuery = query.trim().toLowerCase();

  const filteredTools = useMemo(() => {
    const matches = allTools.filter((tool) => {
      if (activeCategory !== "all" && tool.category !== activeCategory) return false;
      if (!sanitizedQuery) return true;
      const haystack = `${tool.name} ${tool.description} ${tool.host} ${tool.categoryName} ${tool.source}`.toLowerCase();
      return haystack.includes(sanitizedQuery);
    });
    return sortTools(matches, sortId);
  }, [allTools, activeCategory, sanitizedQuery, sortId]);

  const activeCategoryMeta = categories.find((c) => c.id === activeCategory);

  return {
    query,
    setQuery,
    activeCategory,
    selectCategory,
    sortId,
    setSortId,
    categories,
    activeCategoryMeta,
    allTools,
    filteredTools,
  };
}
