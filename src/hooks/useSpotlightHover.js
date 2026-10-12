import { useCallback, useState } from "react";

/**
 * Custom hook to manage spotlight hover and focus depth-of-field state.
 * When any tool is hovered or keyboard focused, other tools blur and dim,
 * creating an immersive spotlight focus effect calibrated for OLED displays.
 */
export function useSpotlightHover() {
  const [hoveredId, setHoveredId] = useState(null);

  const handleMouseEnter = useCallback((id, event) => {
    // Prevent touch devices from getting stuck in blurred state
    if (event?.pointerType === "touch") return;
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const handleFocus = useCallback((id) => {
    setHoveredId(id);
  }, []);

  const handleBlur = useCallback(() => {
    setHoveredId(null);
  }, []);

  return {
    hoveredId,
    hasSpotlight: hoveredId !== null,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  };
}
