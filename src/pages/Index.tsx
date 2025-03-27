import React from "react";
import { ThemeProvider } from "../context/ThemeContext";
import BackgroundEffect from "../components/BackgroundEffect";
import CursorEffect from "../components/CursorEffect";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ToolGrid from "../components/ToolGrid";
import { ArrowUp, Github } from "lucide-react";

const Index: React.FC = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ThemeProvider>
      {/* Background elements */}
      <BackgroundEffect />
      <CursorEffect />

      {/* Main content */}
      <div className="relative min-h-screen">
        {/* Navigation */}
        <Navbar />

        {/* Hero section */}
        <Hero />

        {/* Tools grid */}
        <ToolGrid />

        {/* About section */}
        <section id="about" className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="glass rounded-2xl p-8 border border-border">
              <h2 className="text-3xl font-bold mb-6 text-center">
                About AI ToolBox
              </h2>
              <p className="text-foreground/80 mb-4">
                AI ToolBox is a curated collection of the most powerful and
                innovative artificial intelligence tools available today. Our
                mission is to help you discover the right AI solutions to
                enhance your productivity, creativity, and workflow.
              </p>
              <p className="text-foreground/80 mb-4">
                Whether you're a developer, designer, writer, or just curious
                about AI, we've organized the best tools by category to help you
                find exactly what you need.
              </p>
              <p className="text-foreground/80">
                This project is open-source and continuously updated with new AI
                tools as they emerge. Feel free to contribute or suggest new
                tools to be added to our collection.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <div className="text-lg font-medium">AI ToolBox</div>
                <p className="text-foreground/60 text-sm">
                  A curated collection of AI tools
                </p>
              </div>

              {/* <div className="flex items-center space-x-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-accent transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
              </div> */}
            </div>

            <div className="mt-8 text-center text-sm text-foreground/60">
              &copy; {new Date().getFullYear()} AI ToolBox. All rights reserved
              with Priyansu Pattanaik.
            </div>
          </div>
        </footer>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-accent/90 text-white shadow-lg hover:bg-accent transition-colors duration-300 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </ThemeProvider>
  );
};

export default Index;
