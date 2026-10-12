import React, { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useCatalog } from "./hooks/useCatalog.js";
import { useCatalogDirectory } from "./hooks/useCatalogDirectory.js";
import { useSmoothScroll } from "./hooks/useSmoothScroll.js";
import { useSpotlightHover } from "./hooks/useSpotlightHover.js";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { HeroSection } from "./components/hero/HeroSection.jsx";
import { CategoryChips } from "./components/filters/CategoryChips.jsx";
import { RecentSection } from "./components/tools/RecentSection.jsx";
import { ToolGrid } from "./components/tools/ToolGrid.jsx";
import { AlphabetRail } from "./components/tools/AlphabetRail.jsx";
import { LoadingView } from "./components/common/LoadingView.jsx";
import { EmptyState } from "./components/common/EmptyState.jsx";
import { CatalogError } from "./components/common/CatalogError.jsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.jsx";

export default function App() {
  const reduceMotion = useReducedMotion();
  const { scrollToY, scrollToId } = useSmoothScroll(reduceMotion);

  const { catalog, loading, error, reloadCatalog } = useCatalog();

  const {
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
  } = useCatalogDirectory(catalog);

  const {
    hoveredId,
    hasSpotlight,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  } = useSpotlightHover();

  const [currentLetter, setCurrentLetter] = useState("");

  // Track active letter section for AlphabetRail
  useEffect(() => {
    if (sections.length < 2) return undefined;

    let frame = 0;
    let queued = false;

    const measureActiveLetter = () => {
      queued = false;
      const bar = document.querySelector(".nav-bar-container");
      const threshold = (bar?.getBoundingClientRect().height ?? 64) + 16;
      let active = sections[0].key;

      for (const section of sections) {
        const node = document.getElementById(`letter-${section.key}`);
        if (node && node.getBoundingClientRect().top <= threshold) {
          active = section.key;
        }
      }
      setCurrentLetter((prev) => (prev === active ? prev : active));
    };

    const handleScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(measureActiveLetter);
    };

    measureActiveLetter();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections]);

  const handleResetFilters = () => {
    setQuery("");
    selectCategory("all");
    scrollToY(0);
  };

  if (loading) {
    return <LoadingView />;
  }

  if (!catalog) {
    return <CatalogError message={error} onRetry={reloadCatalog} />;
  }

  return (
    <ErrorBoundary>
      <div className="app-shell">
        <a className="skip-link" href="#tools-directory">
          Skip to directory
        </a>

        {/* Ambient OLED background glow */}
        <div className="ambient-mesh-glow" aria-hidden="true" />

        <Navbar
          totalTools={allTools.length}
          onBrandClick={handleResetFilters}
        />

        <main className="content-container" id="top">
          <HeroSection
            query={query}
            setQuery={setQuery}
            totalTools={allTools.length}
          />

          <CategoryChips
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={selectCategory}
            activeCategoryMeta={activeCategoryMeta}
          />

          <div className="directory-status-bar" aria-live="polite">
            <span className="results-count">
              <strong>{filteredTools.length}</strong> {filteredTools.length === 1 ? "tool" : "tools"}
              {activeCategory !== "all" && activeCategoryMeta ? ` in ${activeCategoryMeta.name}` : ""}
              {query.trim() ? ` matching “${query.trim()}”` : ""}
            </span>
          </div>

          <RecentSection
            recent={recent}
            hoveredId={hoveredId}
            hasSpotlight={hasSpotlight}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {filteredTools.length === 0 ? (
            <EmptyState query={query} onReset={handleResetFilters} />
          ) : (
            <ToolGrid
              sections={sections}
              currentLetter={currentLetter}
              hoveredId={hoveredId}
              hasSpotlight={hasSpotlight}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}

          <Footer
            totalTools={allTools.length}
            totalCategories={categories.length}
            source={catalog.source || "spreadsheet"}
          />
        </main>

        <AlphabetRail
          sections={sections}
          currentLetter={currentLetter}
          onSelectLetter={(letterKey) => scrollToId(`letter-${letterKey}`)}
        />
      </div>
    </ErrorBoundary>
  );
}
