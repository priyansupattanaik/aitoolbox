import { useEffect, useRef } from "react";

function cubicEase(amount) {
  const cx = 3 * 0.4;
  const bx = 3 * (0.2 - 0.4) - cx;
  const ax = 1 - cx - bx;
  const cy = 0;
  const by = 3 * 1 - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  let t = amount;
  for (let i = 0; i < 8; i += 1) {
    const error = sampleX(t) - amount;
    const slope = sampleDX(t);
    if (Math.abs(error) < 1e-5 || Math.abs(slope) < 1e-5) break;
    t -= error / slope;
  }
  return sampleY(Math.min(1, Math.max(0, t)));
}

/**
 * High-performance smooth scroll hook that interrupts on manual user input.
 *
 * @param {boolean} reduceMotion
 */
export function useSmoothScroll(reduceMotion) {
  const frame = useRef(0);
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;

  useEffect(() => {
    const stop = () => cancelAnimationFrame(frame.current);
    const onKey = (event) => {
      if (event.target?.closest?.(".index-rail")) return;
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
        stop();
      }
    };

    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", onKey);
      stop();
    };
  }, []);

  const scrollToY = (target) => {
    const top = Math.max(0, target);
    const jump = () => window.scrollTo({ top, left: 0, behavior: "auto" });
    if (reduceRef.current) {
      jump();
      return;
    }

    cancelAnimationFrame(frame.current);
    const startY = window.scrollY;
    const delta = top - startY;
    if (Math.abs(delta) < 2) return;

    const duration = Math.min(640, Math.max(380, 340 + Math.abs(delta) * 0.15));
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      window.scrollTo({
        top: startY + delta * cubicEase(progress),
        left: 0,
        behavior: "auto",
      });
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
  };

  const scrollToId = (id) => {
    const node = document.getElementById(id);
    if (!node) return;
    const bar = document.querySelector(".nav-bar-container");
    const offset = (bar?.getBoundingClientRect().height ?? 64) + 12;
    scrollToY(node.getBoundingClientRect().top + window.scrollY - offset);
  };

  return { scrollToY, scrollToId };
}
