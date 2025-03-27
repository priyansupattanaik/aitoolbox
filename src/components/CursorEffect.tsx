
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const CursorEffect: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;
    
    // Show cursor on mouse movement
    const showCursor = () => {
      if (!isVisible) setIsVisible(true);
    };
    
    // Hide cursor when mouse leaves window
    const hideCursor = () => {
      setIsVisible(false);
    };
    
    // Update cursor position
    const updateCursorPosition = (e: MouseEvent) => {
      // Main cursor follows with delay
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      
      // Dot follows immediately
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    
    // Handle mouse down effect
    const handleMouseDown = () => {
      cursor.classList.add("scale-75");
      cursorDot.classList.add("scale-150");
    };
    
    // Handle mouse up effect
    const handleMouseUp = () => {
      cursor.classList.remove("scale-75");
      cursorDot.classList.remove("scale-150");
    };
    
    // Add event listeners
    document.addEventListener("mousemove", showCursor);
    document.addEventListener("mousemove", updateCursorPosition);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", hideCursor);
    
    // Add body class to hide default cursor
    document.body.classList.add("custom-cursor-active");
    
    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousemove", showCursor);
      document.removeEventListener("mousemove", updateCursorPosition);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", hideCursor);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isVisible]);
  
  const mainCursorColor = theme === "dark" ? "rgba(100, 220, 255, 0.15)" : "rgba(30, 64, 175, 0.15)";
  const dotColor = theme === "dark" ? "rgba(100, 220, 255, 0.9)" : "rgba(30, 64, 175, 0.9)";
  
  return (
    <>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none -ml-5 -mt-5 z-50 backdrop-blur-sm transition-transform duration-200 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ 
          backgroundColor: mainCursorColor,
          mixBlendMode: "lighten"
        }}
      />
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none -ml-1 -mt-1 z-50 transition-transform duration-150 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: dotColor }}
      />
    </>
  );
};

export default CursorEffect;
