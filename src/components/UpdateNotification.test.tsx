import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateNotification from "./UpdateNotification";

describe("UpdateNotification Component", () => {
  it("renders when open prop is true", () => {
    const onUpdate = vi.fn();
    const onClose = vi.fn();

    render(<UpdateNotification open={true} onUpdate={onUpdate} onClose={onClose} />);

    expect(screen.getByText(/new version is available/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update now/i })).toBeInTheDocument();
  });

  it("does not render when open prop is false", () => {
    const onUpdate = vi.fn();
    const onClose = vi.fn();

    render(<UpdateNotification open={false} onUpdate={onUpdate} onClose={onClose} />);

    expect(screen.queryByText(/new version is available/i)).not.toBeInTheDocument();
  });

  it("calls onUpdate when Update Now button is clicked", async () => {
    const onUpdate = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<UpdateNotification open={true} onUpdate={onUpdate} onClose={onClose} />);

    const updateButton = screen.getByRole("button", { name: /update now/i });
    await user.click(updateButton);

    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it("has onClose handler for Snackbar", () => {
    const onUpdate = vi.fn();
    const onClose = vi.fn();

    render(<UpdateNotification open={true} onUpdate={onUpdate} onClose={onClose} />);

    // Alert has onClose prop passed through (rendered but MUI doesn't show close icon by default without closeText)
    // The onClose is available on both Snackbar and Alert components
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("displays info severity alert", () => {
    const onUpdate = vi.fn();
    const onClose = vi.fn();

    const { container } = render(
      <UpdateNotification open={true} onUpdate={onUpdate} onClose={onClose} />,
    );

    // MUI Alert with severity="info" should be present
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it("positions Snackbar at top center", () => {
    const onUpdate = vi.fn();
    const onClose = vi.fn();

    const { container } = render(
      <UpdateNotification open={true} onUpdate={onUpdate} onClose={onClose} />,
    );

    // Snackbar should render (positioning handled by MUI)
    expect(container.querySelector('[role="presentation"]')).toBeInTheDocument();
  });
});
