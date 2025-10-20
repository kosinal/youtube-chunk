import React from "react";
import useTextOverflow from "./useTextOverflow";
import styles from "./ScrollingText.module.css";

interface ScrollingTextProps {
  text: string;
  isSelected?: boolean;
  className?: string;
}

/**
 * Component that animates text scrolling when content overflows
 * - For selected items: scrolls automatically
 * - For non-selected items: scrolls on hover
 * - Does nothing if text fits without overflow
 */
const ScrollingText: React.FC<ScrollingTextProps> = ({
  text,
  isSelected = false,
  className = "",
}) => {
  const { containerRef, textRef, isOverflowing } = useTextOverflow([text]);

  const containerClass = [styles.scrollContainer, className]
    .filter(Boolean)
    .join(" ");

  const textClass = [
    styles.scrollText,
    isOverflowing && isSelected ? styles.scrollingText : "",
    isOverflowing && !isSelected ? styles.scrollOnHoverText : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      ref={containerRef}
      className={containerClass}
      data-testid="scrolling-text-container"
    >
      <span ref={textRef} className={textClass}>
        {text}
      </span>
    </span>
  );
};

export default ScrollingText;
