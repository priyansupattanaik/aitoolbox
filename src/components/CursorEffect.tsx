import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const CursorEffect: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(false);
  const { theme } = useTheme();

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hasFinePointer) return;

    const showCursor = () => {
      if (!isVisible.current) {
        isVisible.current = true;
        cursor.style.opacity = "1";
        cursorDot.style.opacity = "1";
      }
    };

    const hideCursor = () => {
      isVisible.current = false;
      cursor.style.opacity = "0";
      cursorDot.style.opacity = "0";
    };

    const updateCursorPosition = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const handleMouseDown = () => {
      cursor.classList.add("scale-75");
      cursorDot.classList.add("scale-150");
    };

    const handleMouseUp = () => {
      cursor.classList.remove("scale-75");
      cursorDot.classList.remove("scale-150");
    };

    document.addEventListener("mousemove", showCursor);
    document.addEventListener("mousemove", updateCursorPosition);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", hideCursor);

    return () => {
      document.removeEventListener("mousemove", showCursor);
      document.removeEventListener("mousemove", updateCursorPosition);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

  const mainCursorColor = theme === "dark" ? "rgba(100, 220, 255, 0.15)" : "rgba(30, 64, 175, 0.15)";
  const dotColor = theme === "dark" ? "rgba(100, 220, 255, 0.9)" : "rgba(30, 64, 175, 0.9)";

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none -ml-5 -mt-5 z-50 backdrop-blur-sm transition-transform duration-200 ease-out opacity-0"
        style={{
          backgroundColor: mainCursorColor,
          mixBlendMode: "lighten"
        }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none -ml-1 -mt-1 z-50 transition-transform duration-150 ease-out opacity-0"
        style={{ backgroundColor: dotColor }}
      />
    </>
  );
};

export default CursorEffect;
