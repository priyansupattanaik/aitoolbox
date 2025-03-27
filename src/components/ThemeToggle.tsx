
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full transition-colors duration-300 hover:bg-accent/10 focus:outline-none"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Sun 
          className={`absolute transition-all duration-300 ease-in-out ${
            theme === "dark" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          }`} 
          size={20} 
        />
        <Moon 
          className={`absolute transition-all duration-300 ease-in-out ${
            theme === "light" ? "opacity-0 -rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          }`} 
          size={20} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
