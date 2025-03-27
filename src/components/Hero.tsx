
import React from "react";
import { SearchBar } from "./SearchBar";
import { Zap } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-40" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-40" />
      
      {/* Animated circles */}
      <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-accent/30 rounded-full animate-pulse-light" />
      <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-primary/30 rounded-full animate-pulse-light" style={{ animationDelay: "1s" }} />
      
      {/* Content container with a bit of glass effect */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent mb-6 animate-fade-in">
          <Zap size={12} className="mr-1" />
          <span>Next-Gen AI Tools Collection</span>
        </div>
        
        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="neon-text">AI</span> ToolBox
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Discover and explore the most powerful AI tools to enhance your workflow
        </p>
        
        {/* Search bar */}
        <div className="w-full max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <SearchBar />
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="text-center">
            <p className="text-3xl font-bold neon-text">12+</p>
            <p className="text-foreground/70 text-sm mt-1">Tools</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold neon-text">6</p>
            <p className="text-foreground/70 text-sm mt-1">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold neon-text">100%</p>
            <p className="text-foreground/70 text-sm mt-1">Free to explore</p>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-foreground/70" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
