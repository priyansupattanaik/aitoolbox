import React, { useState } from "react";
import { Tool, categories } from "../data/tools";
import {
  ExternalLink, AppWindow, Share2, Cloud, FileText, Zap, Download,
  Shield, Music, Volume2, Mic, Mic2, Music4, ImageUp, Image, Video,
  PenLine, PenTool, SearchCheck, Brain, Code, GitCommitHorizontal,
  Smartphone, Sparkles, BookOpen, Palette, FlaskConical, Component,
  LayoutDashboard, ShoppingCart, ToggleLeft
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Share2, Cloud, FileText, Zap, Download, Shield, Music, Volume2,
  Mic, Mic2, Music4, ImageUp, Image, Video, PenLine, PenTool,
  SearchCheck, Brain, Code, GitCommitHorizontal, Smartphone, Sparkles,
  BookOpen, Palette, FlaskConical, Component, LayoutDashboard,
  ShoppingCart, ToggleLeft, AppWindow,
};

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[tool.icon] || AppWindow;
  const category = categories.find((c) => c.id === tool.category);

  return (
    <div
      className="group relative animate-scale-in"
      style={{ animationDelay: `${0.05 * index}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
          className={`h-full rounded-xl overflow-hidden border transition-all duration-500 glass ${
          isHovered
            ? "border-accent/50 shadow-xl shadow-accent/10 scale-[1.02]"
            : "border-border shadow-sm"
        }`}
      >
        <div className="p-6 h-full flex flex-col relative z-10">
          {/* Icon + Category badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br from-accent/15 to-primary/15 transition-all duration-300 ${
                  isHovered ? "shadow-lg shadow-accent/20 scale-110" : ""
                }`}
              >
                <IconComponent
                  size={20}
                  className={`text-accent transition-all duration-300 ${
                    isHovered ? "rotate-6" : ""
                  }`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-base leading-tight">{tool.name}</h3>
                {category && (
                  <span className="text-xs text-foreground/50 font-medium">
                    {category.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/70 flex-grow mb-4 leading-relaxed">
            {tool.description}
          </p>

          {/* Link */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-all group/link"
          >
            <span>Visit Tool</span>
            <ExternalLink
              size={14}
              className={`transition-all duration-300 ${
                isHovered ? "translate-x-0.5 -translate-y-0.5" : ""
              }`}
            />
          </a>
        </div>

        {/* Glow overlay */}
        <div
          className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Corner accent */}
      <div
        className={`absolute -top-px -right-px w-16 h-16 overflow-hidden transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-accent/30 to-transparent rounded-bl-3xl" />
      </div>
    </div>
  );
};

export default ToolCard;
