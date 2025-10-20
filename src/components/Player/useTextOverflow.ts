import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to detect if text content is overflowing its container
 * @param deps - Dependency array to re-check overflow when content changes
 * @returns Object with containerRef, textRef, and isOverflowing boolean
 */
const useTextOverflow = (deps: unknown[] = []) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(
    () => {
      const container = containerRef.current;
      const textElement = textRef.current;
      if (!container || !textElement) return;

      // Check if the text width exceeds the container width
      const checkOverflow = () => {
        requestAnimationFrame(() => {
          // Re-check refs in case component unmounted
          const currentContainer = containerRef.current;
          const currentText = textRef.current;

          if (currentContainer && currentText) {
            // Compare the text's natural width (scrollWidth) against container's available width (clientWidth)
            const textWidth = currentText.scrollWidth;
            const containerWidth = currentContainer.clientWidth;
            const overflow = textWidth > containerWidth;
            setIsOverflowing(overflow);
          }
        });
      };

      // Initial check with small delay to ensure DOM is fully rendered
      const timeoutId = setTimeout(checkOverflow, 0);

      // Cleanup timeout
      const cleanupTimeout = () => clearTimeout(timeoutId);

      // Re-check on window resize
      window.addEventListener("resize", checkOverflow);

      // Use ResizeObserver for more reliable detection (if available)
      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(container);
        resizeObserver.observe(textElement);
      }

      return () => {
        cleanupTimeout();
        window.removeEventListener("resize", checkOverflow);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  return { containerRef, textRef, isOverflowing };
};

export default useTextOverflow;
