import React, { useEffect, useState } from "react";
import { ThemeProvider } from "../context/ThemeContext";
import BackgroundEffect from "../components/BackgroundEffect";
import CursorEffect from "../components/CursorEffect";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ToolGrid from "../components/ToolGrid";
import { ArrowUp, Zap } from "lucide-react";

const Index: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 400);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <ThemeProvider>
      <BackgroundEffect />
      <CursorEffect />
      <div className="relative min-h-screen">
        <Navbar />
        <Hero />
        <ToolGrid />

        {/* About section */}
        <section id="about" className="py-20 sm:py-28 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                About <span className="text-gradient">AI ToolBox</span>
              </h2>
              <p className="text-foreground/60 max-w-2xl mx-auto">
                A curated collection of the most powerful AI tools
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Curated Selection",
                  desc: "Every tool is hand-picked and organized by category to help you find exactly what you need.",
                  icon: "🎯",
                },
                {
                  title: "Always Free",
                  desc: "All listed tools are free to explore. No paywalls, no subscriptions required.",
                  icon: "💎",
                },
                {
                  title: "Community Driven",
                  desc: "Open-source and continuously updated with new AI tools as they emerge.",
                  icon: "🌍",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="glass rounded-2xl p-6 border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 reveal"
                  style={{ animationDelay: `${0.1 * i}s` }}
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border/50">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-lg font-medium">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="font-mono text-sm">AI ToolBox</span>
              </div>
              <p className="text-foreground/50 text-xs text-center">
                A curated collection of AI tools
              </p>
              <div className="text-xs text-foreground/40 text-center">
                &copy; {new Date().getFullYear()} All rights reserved
              </div>
            </div>
          </div>
        </footer>

        {/* Scroll to top with progress ring */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ${
            showScrollTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          aria-label="Scroll to top"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke="currentColor"
                className="text-border"
                strokeWidth="2"
              />
              <circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke="currentColor"
                className="text-accent"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.15s ease" }}
              />
            </svg>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 active:scale-90">
              <ArrowUp size={18} className="text-white" />
            </div>
          </div>
        </button>
      </div>
    </ThemeProvider>
  );
};

export default Index;
