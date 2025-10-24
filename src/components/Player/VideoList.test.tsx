import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoList from "./VideoList";
import type { Video } from "./playerSlice";

describe("VideoList", () => {
  const mockVideos: Video[] = [
    {
      url: "https://www.youtube.com/watch?v=abc123",
      id: "abc123",
      title: "Test Video 1",
    },
    {
      url: "https://www.youtube.com/watch?v=def456",
      id: "def456",
      title: "Test Video 2",
    },
    {
      url: "https://www.youtube.com/watch?v=ghi789",
      id: "ghi789",
      title: "Test Video 3",
    },
  ];

  it("renders nothing when videos array is empty", () => {
    const { container } = render(
      <VideoList
        videos={[]}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
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
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );
    expect(screen.getByText(/Playlist \(3 videos\)/i)).toBeInTheDocument();
  });

  it("renders all videos in the list with titles", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    mockVideos.forEach((video, index) => {
      expect(
        screen.getByText(`${index + 1}. ${video.title}`),
      ).toBeInTheDocument();
    });
  });

  it("highlights the current video", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={1}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    const currentVideoItem = screen
      .getByText(`2. ${mockVideos[1].title}`)
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
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    const secondVideo = screen.getByText("2. " + mockVideos[1].title);
    await user.click(secondVideo);

    expect(mockOnVideoSelect).toHaveBeenCalledWith(1);
  });

  it("disables video selection when playing", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={true}
      />,
    );

    mockVideos.forEach((video, index) => {
      const videoButton = screen
        .getByText(`${index + 1}. ${video.title}`)
        .closest('[role="button"]');
      expect(videoButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("displays singular video when count is 1", () => {
    const singleVideo: Video[] = [
      {
        url: "https://www.youtube.com/watch?v=abc123",
        id: "abc123",
        title: "Single Test Video",
      },
    ];

    render(
      <VideoList
        videos={singleVideo}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    expect(screen.getByText(/Playlist \(1 video\)/i)).toBeInTheDocument();
  });

  it("falls back to URL when title is not available", () => {
    const videosWithoutTitles: Video[] = [
      { url: "https://www.youtube.com/watch?v=abc123", id: "abc123" },
      { url: "https://www.youtube.com/watch?v=def456", id: "def456" },
    ];

    render(
      <VideoList
        videos={videosWithoutTitles}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    videosWithoutTitles.forEach((video, index) => {
      expect(
        screen.getByText(`${index + 1}. ${video.url}`),
      ).toBeInTheDocument();
    });
  });

  it("renders delete icon for each video", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    const deleteButtons = screen.getAllByLabelText("delete");
    expect(deleteButtons).toHaveLength(mockVideos.length);
  });

  it("shows pending delete state on first delete click", async () => {
    const user = userEvent.setup();
    const mockOnDeleteVideo = vi.fn();

    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={mockOnDeleteVideo}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    const deleteButtons = screen.getAllByLabelText("delete");
    await user.click(deleteButtons[1]);

    expect(mockOnDeleteVideo).not.toHaveBeenCalled();
  });

  it("calls onDeleteVideo on second delete click", async () => {
    const user = userEvent.setup();
    const mockOnDeleteVideo = vi.fn();

    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={mockOnDeleteVideo}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    const deleteButtons = screen.getAllByLabelText("delete");
    await user.click(deleteButtons[1]);
    await user.click(deleteButtons[1]);

    expect(mockOnDeleteVideo).toHaveBeenCalledWith(1);
  });

  it("resets pending delete when clicking different delete icon", async () => {
    const user = userEvent.setup();
    const mockOnDeleteVideo = vi.fn();

    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={mockOnDeleteVideo}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    const deleteButtons = screen.getAllByLabelText("delete");
    await user.click(deleteButtons[0]);
    await user.click(deleteButtons[1]);

    expect(mockOnDeleteVideo).not.toHaveBeenCalled();
  });

  it("disables delete buttons when playing", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={true}
      />,
    );

    const deleteButtons = screen.getAllByLabelText("delete");
    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("clears pending delete state when playlist loses focus", async () => {
    const user = userEvent.setup();
    const mockOnDeleteVideo = vi.fn();

    render(
      <div>
        <VideoList
          videos={mockVideos}
          currentIndex={0}
          onVideoSelect={vi.fn()}
          onDeleteVideo={mockOnDeleteVideo}
          onClearPlaylist={vi.fn()}
          isPlaying={false}
        />
        <button data-testid="outside-button">Outside Button</button>
      </div>,
    );

    // Click delete button to enter pending state
    const deleteButtons = screen.getAllByLabelText("delete");
    await user.click(deleteButtons[1]);

    // Verify pending state was set (delete not called yet)
    expect(mockOnDeleteVideo).not.toHaveBeenCalled();

    // Click outside button to trigger blur on playlist
    const outsideButton = screen.getByTestId("outside-button");
    await user.click(outsideButton);

    // Click the same delete button again - should require first click again
    await user.click(deleteButtons[1]);
    expect(mockOnDeleteVideo).not.toHaveBeenCalled();

    // Second click should now delete
    await user.click(deleteButtons[1]);
    expect(mockOnDeleteVideo).toHaveBeenCalledWith(1);
  });

  it("calls onClearPlaylist when Playlist title is clicked", async () => {
    const user = userEvent.setup();
    const mockOnClearPlaylist = vi.fn();

    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={mockOnClearPlaylist}
        isPlaying={false}
      />,
    );

    const playlistTitle = screen.getByText(/Playlist \(3 videos\)/i);
    await user.click(playlistTitle);

    expect(mockOnClearPlaylist).toHaveBeenCalledTimes(1);
  });

  it("does not call onClearPlaylist when title is clicked while playing", async () => {
    const user = userEvent.setup();
    const mockOnClearPlaylist = vi.fn();

    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={mockOnClearPlaylist}
        isPlaying={true}
      />,
    );

    const playlistTitle = screen.getByText(/Playlist \(3 videos\)/i);
    await user.click(playlistTitle);

    expect(mockOnClearPlaylist).not.toHaveBeenCalled();
  });

  it("Playlist title has pointer cursor when not playing", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={false}
      />,
    );

    const playlistTitle = screen.getByText(/Playlist \(3 videos\)/i);
    expect(playlistTitle).toHaveStyle({ cursor: "pointer" });
  });

  it("Playlist title has default cursor when playing", () => {
    render(
      <VideoList
        videos={mockVideos}
        currentIndex={0}
        onVideoSelect={vi.fn()}
        onDeleteVideo={vi.fn()}
        onClearPlaylist={vi.fn()}
        isPlaying={true}
      />,
    );

    const playlistTitle = screen.getByText(/Playlist \(3 videos\)/i);
    expect(playlistTitle).toHaveStyle({ cursor: "default" });
  });
});
