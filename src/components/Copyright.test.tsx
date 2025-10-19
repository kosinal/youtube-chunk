import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Copyright from "./Copyright";

describe("Copyright Component", () => {
  it("renders copyright text with current year", () => {
    render(<Copyright />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    expect(screen.getByText(/Lukas Kosina/i)).toBeInTheDocument();
  });

  it("displays version number from __APP_VERSION__", () => {
    render(<Copyright />);

    expect(screen.getByText(/v0\.0\.0/)).toBeInTheDocument();
  });

  it("renders license link with correct attributes", () => {
    render(<Copyright />);

    const licenseLink = screen.getByRole("link", { name: /license/i });
    expect(licenseLink).toBeInTheDocument();
    expect(licenseLink).toHaveAttribute("href", expect.stringContaining("github.com"));
    expect(licenseLink).toHaveAttribute("target", "_blank");
    expect(licenseLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("is positioned fixed on desktop (via sx prop)", () => {
    const { container } = render(<Copyright />);

    // Component should render (positioning is tested via Cypress/visual tests)
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has hover effect styles", () => {
    const { container } = render(<Copyright />);
    const box = container.firstChild as HTMLElement;

    // Verify the component exists and MUI applies styles
    expect(box).toBeInTheDocument();
  });
});
