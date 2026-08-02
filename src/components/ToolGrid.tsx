import React, { useState } from "react";
import { categories, tools } from "../data/tools";
import ToolCard from "./ToolCard";
import { Grid, List, ExternalLink, Layers, AppWindow, Share2, Cloud, FileText, Zap, Download, Shield, Music, Volume2, Mic, Mic2, Music4, ImageUp, Image, Video, PenLine, PenTool, SearchCheck, Brain, Code, GitCommitHorizontal, Smartphone, Sparkles, BookOpen, Palette, FlaskConical, Component, LayoutDashboard, ShoppingCart, ToggleLeft } from "lucide-react";

const listIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Share2, Cloud, FileText, Zap, Download, Shield, Music, Volume2,
  Mic, Mic2, Music4, ImageUp, Image, Video, PenLine, PenTool,
  SearchCheck, Brain, Code, GitCommitHorizontal, Smartphone, Sparkles,
  BookOpen, Palette, FlaskConical, Component, LayoutDashboard,
  ShoppingCart, ToggleLeft, AppWindow,
};

const ToolGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTools = activeCategory
    ? tools.filter((tool) => tool.category === activeCategory)
    : tools;

  const getCategoryCount = (catId: string | null) => {
    if (!catId) return tools.length;
    return tools.filter((t) => t.category === catId).length;
  };

  const allCategories = [
    { id: null, name: "All" },
    ...categories,
  ];

  return (
    <section id="tools" className="py-20 sm:py-28 px-4">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="mb-4 text-center reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent mb-4">
            <Layers size={12} />
            <span>Browse Tools</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Explore{" "}
            <span className="text-gradient">AI Tools</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-sm sm:text-base">
            Discover powerful AI tools designed to enhance your productivity and creativity
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          {/* Category filters with count badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {allCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id ?? "all"}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-accent to-primary text-white shadow-lg shadow-accent/25 scale-105"
                      : "bg-secondary/10 hover:bg-secondary/20 text-foreground/70 hover:text-foreground border border-border/50"
                  }`}
                >
                  {cat.name}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-secondary/20 text-foreground/60"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-secondary/10 p-1 rounded-xl border border-border/50">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-background text-accent shadow-sm"
                  : "text-foreground/50 hover:text-foreground"
              }`}
              aria-label="Grid view"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-background text-accent shadow-sm"
                  : "text-foreground/50 hover:text-foreground"
              }`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Tools display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {filteredTools.map((tool) => {
              const IconComponent = listIconMap[tool.icon] || AppWindow;
              const cat = categories.find((c) => c.id === tool.category);
              return (
                <div
                  key={tool.id}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border/60 glass hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
                >
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/15 to-primary/15 text-accent flex-shrink-0">
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
                      {cat && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-foreground/50 font-medium flex-shrink-0">
                          {cat.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/60 truncate">{tool.description}</p>
                  </div>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-2.5 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                    aria-label={`Visit ${tool.name}`}
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16 glass rounded-2xl border border-border/50">
            <p className="text-foreground/50 text-lg">No tools found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolGrid;
