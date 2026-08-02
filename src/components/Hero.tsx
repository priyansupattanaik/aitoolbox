import React, { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { Sparkles, ArrowDown } from "lucide-react";
import { tools, categories } from "../data/tools";

const words = ["enhance your workflow", "supercharge your creativity", "accelerate your development", "unlock new possibilities"];

const Typewriter: React.FC<{ words: string[] }> = ({ words }) => {
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((p) => p + 1), 50);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((p) => p - 1), 25);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setIndex((p) => (p + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index, words]);

  return (
    <span>
      {words[index].substring(0, charIndex)}
      <span className="animate-pulse-light">|</span>
    </span>
  );
};

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const toolCount = tools.length;
  const categoryCount = categories.length;

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Parallax decorative elements */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 bg-accent/15 rounded-full blur-3xl opacity-40 transition-transform duration-500"
        style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl opacity-40 transition-transform duration-500"
        style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-32 h-32 bg-accent/10 rounded-full blur-2xl transition-transform duration-700"
        style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -15}px)` }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-5 h-5 bg-accent/40 rounded-full animate-float shadow-lg shadow-accent/20" />
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-primary/40 rounded-full animate-float shadow-lg shadow-primary/20" style={{ animationDelay: "2s" }} />
      <div className="absolute top-2/3 left-1/3 w-4 h-4 bg-accent/30 rounded-full animate-float shadow-lg shadow-accent/10" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge with shimmer */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-accent/15 to-primary/15 text-accent border border-accent/20 mb-6 animate-fade-in shadow-sm">
          <Sparkles size={12} className="text-accent" />
          <span>Next-Gen AI Tools Collection</span>
        </div>

        {/* Heading with gradient */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="text-gradient">AI</span>{" "}
          <span className="text-foreground">ToolBox</span>
        </h1>

        {/* Typewriter subtitle */}
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-2 h-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Discover AI tools to{" "}
          <span className="text-accent font-medium">
            <Typewriter words={words} />
          </span>
        </p>

        {/* Subtitle */}
        <p className="text-sm text-foreground/50 max-w-xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          Curated collection of the most powerful AI tools organized by category
        </p>

        {/* Search */}
        <div className="w-full max-w-xl mx-auto animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <SearchBar />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {[
            { value: `${toolCount}+`, label: "Tools" },
            { value: `${categoryCount}`, label: "Categories" },
            { value: "100%", label: "Free to explore" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group cursor-default">
              <p className="text-3xl sm:text-4xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </p>
              <p className="text-foreground/60 text-sm mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => {
          document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-foreground/40 hover:text-accent transition-colors group cursor-pointer"
        aria-label="Scroll to tools"
      >
        <span className="text-xs font-medium">Scroll</span>
        <ArrowDown size={16} className="group-hover:animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;
