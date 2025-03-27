
import React, { useState } from "react";
import { categories, tools } from "../data/tools";
import ToolCard from "./ToolCard";
import { Grid, List } from "lucide-react";

const ToolGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const filteredTools = activeCategory
    ? tools.filter((tool) => tool.category === activeCategory)
    : tools;
  
  return (
    <section id="tools" className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore AI Tools</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Discover the most powerful AI tools designed to enhance your productivity and creativity
          </p>
        </div>
        
        {/* Category filters and view toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeCategory === null
                  ? "bg-accent text-white"
                  : "bg-secondary/20 hover:bg-secondary/30"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? "bg-accent text-white"
                    : "bg-secondary/20 hover:bg-secondary/30"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* View toggle */}
          <div className="flex items-center space-x-2 bg-secondary/20 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-accent/20 text-accent" : "hover:bg-secondary/30"
              }`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list" ? "bg-accent/20 text-accent" : "hover:bg-secondary/30"
              }`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
        
        {/* Tools grid */}
        <div className={`
          ${viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col space-y-4"}
        `}>
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        {/* Empty state */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/70">No tools found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolGrid;
