import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowSquareOut,
  Check,
  Copy,
  GithubLogo,
  MagnifyingGlass,
  TerminalWindow,
  X,
} from "@phosphor-icons/react";
import fallbackCatalog from "./data/catalog.json";
import { loadCatalog } from "./lib/loadCatalog";

function getInstallCommand(tool) {
  if (!tool) return "";
  const rawUrl = tool.url || "";
  if (rawUrl.includes("github.com/")) {
    const clean = rawUrl.replace(/\/+$/, "").replace(/\.git$/, "");
    return `git clone ${clean}.git`;
  }
  const slug = (tool.id || tool.name || "tool")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `npx aitoolbox ${slug}`;
}

export default function App() {
  const [catalog, setCatalog] = useState(fallbackCatalog);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  // Load live Google Sheet catalog with graceful fallback
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const live = await loadCatalog();
      if (cancelled) return;
      if (live) setCatalog(live);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hash-routing sync for category selection
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && hash !== "top") {
        setActiveCategory(hash);
      } else {
        setActiveCategory("all");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Keyboard shortcut '/' for quick search focus, 'Escape' to clear
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      if (e.key === "Escape" && document.activeElement?.id === "search-input") {
        setQuery("");
        document.getElementById("search-input")?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Category list from catalog
  const categories = useMemo(() => {
    return catalog.groups.map((g) => ({
      id: g.category.id,
      name: g.category.name,
      description: g.category.description,
      count: g.tools.length,
    }));
  }, [catalog]);

  // Flatten all tools across categories
  const allTools = useMemo(() => {
    const list = [];
    for (const group of catalog.groups) {
      for (const tool of group.tools) {
        list.push({
          ...tool,
          categoryName: group.category.name,
          categoryDescription: group.category.description,
        });
      }
    }
    return list;
  }, [catalog]);

  // Real-time search filter
  const q = query.trim().toLowerCase();
  const filteredTools = useMemo(() => {
    return allTools.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      const haystack = `${t.name} ${t.description} ${t.host} ${t.categoryName}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [allTools, activeCategory, q]);

  // 1-click copy snippet
  const handleCopyCommand = (cmd, toolId) => {
    if (!cmd) return;
    navigator.clipboard?.writeText(cmd);
    setCopiedId(toolId);
    setTimeout(() => {
      setCopiedId((curr) => (curr === toolId ? null : curr));
    }, 1800);
  };

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    if (catId === "all") {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    } else {
      window.location.hash = catId;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f4f5] selection:bg-zinc-800 selection:text-white flex flex-col font-sans">
      {/* Top utility bar */}
      <header className="border-b border-zinc-900 bg-[#000000]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleSelectCategory("all");
              setQuery("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-sm font-semibold tracking-tight text-zinc-100 hover:text-white transition-colors"
          >
            AI ToolBox
          </a>

          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="font-mono">{allTools.length} tools</span>
            <a
              href="https://github.com/priyansupattanaik/aitoolbox"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
              title="GitHub Repository"
              aria-label="GitHub Repository"
            >
              <GithubLogo size={18} weight="bold" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-10 pb-20">
        {/* Functional Minimalist Hero */}
        <section className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 mb-2">
            AI ToolBox
          </h1>
          <p className="text-base text-zinc-400">
            Developer index of AI tools, skills, and libraries
          </p>
        </section>

        {/* Search Input */}
        <section className="mb-5 max-w-2xl">
          <div className="relative flex items-center bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-3.5 py-2.5 focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600 transition-all">
            <MagnifyingGlass size={18} className="text-zinc-400 shrink-0 mr-2.5" />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, description, or host... (Press /)"
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors mr-2"
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 rounded">
              /
            </kbd>
          </div>
        </section>

        {/* Category Pills */}
        <section className="mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex-wrap">
            <button
              type="button"
              onClick={() => handleSelectCategory("all")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 border ${
                activeCategory === "all"
                  ? "bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold shadow-xs"
                  : "bg-[#0a0a0a] text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              All <span className="text-[11px] opacity-70 ml-1 font-mono">({allTools.length})</span>
            </button>

            {categories.map((c) => {
              const isSelected = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCategory(c.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 border ${
                    isSelected
                      ? "bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold shadow-xs"
                      : "bg-[#0a0a0a] text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  {c.name}
                  <span className="text-[11px] opacity-70 ml-1 font-mono">({c.count})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Results Counter / Status */}
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-6 pb-2 border-b border-zinc-900 font-mono">
          <span>
            Showing {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
            {activeCategory !== "all" ? ` in ${categories.find((c) => c.id === activeCategory)?.name || activeCategory}` : ""}
          </span>
          {loading && <span>Updating live catalog...</span>}
        </div>

        {/* Tool Cards Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-zinc-900 rounded-2xl bg-[#0a0a0a]">
            <p className="text-sm text-zinc-400 mb-3">
              No tools match &ldquo;{query}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                handleSelectCategory("all");
              }}
              className="text-xs px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors font-medium border border-zinc-800"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => {
              const command = getInstallCommand(tool);
              const isCopied = copiedId === tool.id;

              return (
                <article
                  key={tool.id}
                  className="rounded-2xl border border-zinc-800/70 bg-[#0a0a0a] p-4 sm:p-5 hover:border-zinc-700 transition-colors flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-2.5">
                    {/* Top row: Name, Category Badge, Direct Link */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                        <h2 className="text-base font-semibold tracking-tight text-zinc-100">
                          {tool.name}
                        </h2>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {tool.categoryName}
                        </span>
                      </div>

                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-950 hover:bg-white hover:text-black transition-colors"
                      >
                        <span>Visit</span>
                        <ArrowSquareOut size={12} weight="bold" />
                      </a>
                    </div>

                    {/* 1-line description directly from catalog / sheet */}
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    {/* CLI command snippet / copy bar */}
                    {command && (
                      <div className="flex items-center justify-between gap-2 bg-[#000000] border border-zinc-850 border-zinc-800/80 rounded-lg px-2.5 py-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto no-scrollbar">
                          <TerminalWindow size={13} className="text-zinc-500 shrink-0" />
                          <code className="text-[11px] font-mono text-zinc-300 whitespace-nowrap select-all">
                            {command}
                          </code>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCommand(command, tool.id)}
                          className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            isCopied
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                          }`}
                          title="Copy command to clipboard"
                          aria-label={`Copy command for ${tool.name}`}
                        >
                          {isCopied ? (
                            <>
                              <Check size={11} weight="bold" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Host note */}
                    {tool.host && (
                      <div className="text-[10px] font-mono text-zinc-500">
                        {tool.host}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Clean Colophon Footer */}
      <footer className="border-t border-zinc-900 bg-[#000000] py-8 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            AI ToolBox &middot; Curated by {catalog.site?.author || "Priyansu Pattanaik"}
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Back to top &uarr;
          </a>
        </div>
      </footer>
    </div>
  );
}
