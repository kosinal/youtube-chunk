import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoList from "./VideoList";
import type { Video } from "./playerSlice";

describe("VideoList", () => {
  const mockVideos: Video[] = [
    { url: "https://www.youtube.com/watch?v=abc123", id: "abc123" },
    { url: "https://www.youtube.com/watch?v=def456", id: "def456" },
    { url: "https://www.youtube.com/watch?v=ghi789", id: "ghi789" },
  ];

  it("renders nothing when videos array is empty", () => {
    const { container } = render(
      <VideoList
        videos={[]}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        isPlaying={false}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders playlist with correct video count", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        isPlaying={false}
      />,
    );
    expect(screen.getByText(/Playlist \(3 videos\)/i)).toBeInTheDocument();
  });

  it("renders all videos in the list", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        isPlaying={false}
      />,
    );

    mockVideos.forEach((video, index) => {
      expect(
        screen.getByText(`${index + 1}. ${video.url}`),
      ).toBeInTheDocument();
    });
  });

  it("highlights the current video", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={1}
        onVideoSelect={vi.fn()}
        isPlaying={false}
      />,
    );

    const currentVideoItem = screen
      .getByText(`2. ${mockVideos[1].url}`)
      .closest('[role="button"]');
    expect(currentVideoItem).toHaveClass("Mui-selected");
  });

  it("calls onVideoSelect when a video is clicked", async () => {
    const user = userEvent.setup();
    const mockOnVideoSelect = vi.fn();

    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={mockOnVideoSelect}
        isPlaying={false}
      />,
    );

    const secondVideo = screen.getByText("2. " + mockVideos[1].url);
    await user.click(secondVideo);

    expect(mockOnVideoSelect).toHaveBeenCalledWith(1);
  });

  it("disables video selection when playing", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        isPlaying={true}
      />,
    );

    mockVideos.forEach((video, index) => {
      const videoButton = screen
        .getByText(`${index + 1}. ${video.url}`)
        .closest('[role="button"]');
      expect(videoButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("displays singular video when count is 1", () => {
    const singleVideo: Video[] = [
      { url: "https://www.youtube.com/watch?v=abc123", id: "abc123" },
    ];

    render(
      <VideoList
        videos={singleVideo}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        isPlaying={false}
      />,
    );

    expect(screen.getByText(/Playlist \(1 video\)/i)).toBeInTheDocument();
  });
});
