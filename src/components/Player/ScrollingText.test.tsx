import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ScrollingText from "./ScrollingText";
import useTextOverflow from "./useTextOverflow";

// Mock the useTextOverflow hook
vi.mock("./useTextOverflow");

describe("ScrollingText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders text correctly", () => {
    vi.mocked(useTextOverflow).mockReturnValue({
      containerRef: { current: null },
      textRef: { current: null },
      isOverflowing: false,
    });

    render(<ScrollingText text="Test Video Title" />);
    expect(screen.getByText("Test Video Title")).toBeInTheDocument();
  });

  it("applies scrolling class when selected and overflowing", () => {
    vi.mocked(useTextOverflow).mockReturnValue({
      containerRef: { current: null },
      textRef: { current: null },
      isOverflowing: true,
    });

    render(
      <ScrollingText text="Very Long Video Title That Overflows" isSelected />,
    );

    const scrollContainer = screen.getByTestId("scrolling-text-container");
    const textElement = scrollContainer.querySelector("span");
    expect(textElement?.className).toContain("scrollingText");
  });

  it("applies scrollOnHover class when not selected and overflowing", () => {
    vi.mocked(useTextOverflow).mockReturnValue({
      containerRef: { current: null },
      textRef: { current: null },
      isOverflowing: true,
    });

    render(
      <ScrollingText
        text="Very Long Video Title That Overflows"
        isSelected={false}
      />,
    );

    const scrollContainer = screen.getByTestId("scrolling-text-container");
    const textElement = scrollContainer.querySelector("span");
    expect(textElement?.className).toContain("scrollOnHoverText");
    expect(textElement?.className).not.toContain("scrollingText");
  });

  it("does not apply animation classes when text is not overflowing", () => {
    vi.mocked(useTextOverflow).mockReturnValue({
      containerRef: { current: null },
      textRef: { current: null },
      isOverflowing: false,
    });

    render(<ScrollingText text="Short Title" isSelected />);

    const scrollContainer = screen.getByTestId("scrolling-text-container");
    const textElement = scrollContainer.querySelector("span");
    expect(textElement?.className).not.toContain("scrollingText");
    expect(textElement?.className).not.toContain("scrollOnHoverText");
  });

  it("applies custom className when provided", () => {
    vi.mocked(useTextOverflow).mockReturnValue({
      containerRef: { current: null },
      textRef: { current: null },
      isOverflowing: false,
    });

    render(<ScrollingText text="Test" className="customClass" />);

    const scrollContainer = screen.getByTestId("scrolling-text-container");
    expect(scrollContainer.className).toContain("customClass");
  });

  it("combines multiple classes correctly", () => {
    vi.mocked(useTextOverflow).mockReturnValue({
      containerRef: { current: null },
      textRef: { current: null },
      isOverflowing: true,
    });

    render(<ScrollingText text="Test" isSelected className="customClass" />);

    const scrollContainer = screen.getByTestId("scrolling-text-container");
    const textElement = scrollContainer.querySelector("span");

    expect(scrollContainer.className).toContain("scrollContainer");
    expect(scrollContainer.className).toContain("customClass");
    expect(textElement?.className).toContain("scrollText");
    expect(textElement?.className).toContain("scrollingText");
  });

  it("passes text to useTextOverflow hook as dependency", () => {
    vi.mocked(useTextOverflow).mockReturnValue({
      containerRef: { current: null },
      textRef: { current: null },
      isOverflowing: false,
    });

    const testText = "Dynamic Text";
    render(<ScrollingText text={testText} />);

    expect(useTextOverflow).toHaveBeenCalledWith([testText]);
  });
});
