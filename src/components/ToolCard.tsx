
import React from "react";
import { Tool } from "../data/tools";
import { ExternalLink } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  // Dynamically get the icon from lucide-react
  const IconComponent = tool.icon && LucideIcons[tool.icon as keyof typeof LucideIcons]
    ? LucideIcons[tool.icon as keyof typeof LucideIcons]
    : LucideIcons.AppWindow;
  
  return (
    <div className="group relative animate-scale-in">
      <div className="h-full rounded-xl overflow-hidden border border-border transition-all duration-300 hover:border-accent/50 hover:shadow-lg glass sci-fi-border">
        <div className="p-6 h-full flex flex-col">
          {/* Icon and name */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-lg bg-accent/10 text-accent">
                {IconComponent && <IconComponent size={20} />}
              </div>
              <h3 className="font-medium text-lg">{tool.name}</h3>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-foreground/70 flex-grow mb-4">
            {tool.description}
          </p>
          
          {/* Link */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            Visit Tool <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-accent/5 opacity-0 group-hover:opacity-100 group-hover:animate-glow transition-opacity duration-300"></div>
    </div>
  );
};

export default ToolCard;
