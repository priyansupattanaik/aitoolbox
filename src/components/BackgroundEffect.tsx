import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let isActive = true;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    const maxParticles = 60;
    const particleCount = Math.min(
      Math.floor(window.innerWidth / 25),
      maxParticles
    );

    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      velocity: { x: number; y: number };
      opacity: number;
    }

    let particles: Particle[] = [];

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          color: theme === "dark" ? "#3b82f6" : "#1e40af",
          velocity: {
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2,
          },
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    createParticles();

    const drawGrid = () => {
      const gridSize = 30;
      const gridColor =
        theme === "dark"
          ? "rgba(100, 220, 255, 0.05)"
          : "rgba(30, 64, 175, 0.03)";

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      if (!isActive) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      particles.forEach((particle) => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false;
        cancelAnimationFrame(animationId);
      } else {
        isActive = true;
        animationId = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", setCanvasDimensions);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-70"
    />
  );
};

export default BackgroundEffect;
