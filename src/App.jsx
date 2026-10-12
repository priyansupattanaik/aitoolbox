import React from "react";
import { useCatalog } from "./hooks/useCatalog.js";
import { useCatalogDirectory } from "./hooks/useCatalogDirectory.js";
import { useSpotlightHover } from "./hooks/useSpotlightHover.js";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { SearchBar } from "./components/hero/SearchBar.jsx";
import { CategoryNav } from "./components/filters/CategoryNav.jsx";
import { SortSelect } from "./components/filters/SortSelect.jsx";
import { ToolCard } from "./components/tools/ToolCard.jsx";
import { LoadingView } from "./components/common/LoadingView.jsx";
import { EmptyState } from "./components/common/EmptyState.jsx";
import { CatalogError } from "./components/common/CatalogError.jsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.jsx";
import { SORT_OPTIONS } from "./utils/sort.js";

export default function App() {
  const { catalog, loading, error, reloadCatalog } = useCatalog();
  const {
    query, setQuery, activeCategory, selectCategory, sortId, setSortId,
    categories, activeCategoryMeta, allTools, filteredTools,
  } = useCatalogDirectory(catalog);
  const { hoveredId, handleMouseEnter, handleMouseLeave, handleFocus, handleBlur } = useSpotlightHover();

  const reset = () => {
    setQuery("");
    selectCategory("all");
    window.scrollTo({ top: 0 });
  };

  if (loading) return <LoadingView />;
  if (!catalog) return <CatalogError message={error} onRetry={reloadCatalog} />;

  const sortLabel = SORT_OPTIONS.find((o) => o.id === sortId)?.label || "";

  return (
    <ErrorBoundary>
      <div className="app-shell">
        <a className="skip-link" href="#tools-directory">Skip to tools</a>
        <Header totalTools={allTools.length} totalCategories={categories.length} onBrandClick={reset} />

        <section className="intro">
          <h1>Free &amp; open-source AI tools</h1>
          <p>A curated directory of AI, UI and agent tools, loaded live from the AIToolBox DB sheet.</p>
        </section>

        <div className="layout">
          <aside className="layout-sidebar">
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={selectCategory}
              totalTools={allTools.length}
            />
          </aside>

          <main className="layout-main" id="tools-directory">
            <div className="toolbar">
              <SearchBar query={query} setQuery={setQuery} />
              <SortSelect value={sortId} onChange={setSortId} />
            </div>

            <div className="results-bar" aria-live="polite">
              <span className="results-count" data-testid="results-count">
                <strong>{filteredTools.length}</strong> {filteredTools.length === 1 ? "tool" : "tools"}
                {activeCategoryMeta ? ` in ${activeCategoryMeta.name}` : ""}
                {query.trim() ? ` matching “${query.trim()}”` : ""}
              </span>
              <span className="results-sort">Sorted by {sortLabel}</span>
            </div>

            {filteredTools.length === 0 ? (
              <EmptyState query={query} onReset={reset} />
            ) : (
              <div className="tools-grid">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={`${tool.index}-${tool.id}`}
                    tool={tool}
                    domId={`tool-${tool.index}`}
                    isHovered={hoveredId === tool.index}
                    onMouseEnter={(e) => handleMouseEnter(tool.index, e)}
                    onMouseLeave={handleMouseLeave}
                    onFocus={() => handleFocus(tool.index)}
                    onBlur={handleBlur}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        <Footer totalTools={allTools.length} totalCategories={categories.length} source={catalog.source || "spreadsheet"} />
      </div>
    </ErrorBoundary>
  );
}
