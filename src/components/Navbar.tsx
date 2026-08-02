import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, Zap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);

      const sections = ["home", "tools", "about"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "home", name: "Home" },
    { id: "tools", name: "Tools" },
    { id: "about", name: "About" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-background/80 backdrop-blur-xl shadow-sm"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2 text-lg font-medium cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center animate-pulse-light shadow-lg shadow-accent/20">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-mono tracking-tight">
            AI<span className="text-gradient font-bold">ToolBox</span>
          </span>
        </button>

        {!isMobile && (
          <div className="flex items-center space-x-1">
            <ul className="flex space-x-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                      activeSection === link.id
                        ? "text-accent"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                    }`}
                  >
                    {link.name}
                    {activeSection === link.id && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="ml-4 flex items-center border-l border-border pl-4">
              <ThemeToggle />
            </div>
          </div>
        )}

        {isMobile && (
          <div className="flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2 p-2 rounded-md text-foreground hover:bg-accent/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        )}
      </div>

      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent to-primary transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Mobile menu */}
      <div
        className={`absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <ul className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    activeSection === link.id
                      ? "bg-accent/10 text-accent"
                      : "text-foreground/70 hover:bg-accent/5 hover:text-foreground"
                  }`}
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
