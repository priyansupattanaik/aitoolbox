
import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, Zap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Update navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Tools", href: "#tools" },
    { name: "Categories", href: "#categories" },
    { name: "About", href: "#about" }
  ];
  
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-background/80 backdrop-blur-lg shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#" 
          className="flex items-center gap-2 text-lg font-medium"
        >
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center animate-pulse-light">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-mono tracking-tight">AI ToolBox</span>
        </a>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center space-x-1">
            <ul className="flex space-x-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent/10"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="ml-4 flex items-center">
              <ThemeToggle />
            </div>
          </div>
        )}
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2 p-2 rounded-md text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobile && (
        <div
          className={`absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg shadow-md transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
