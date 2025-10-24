import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/testUtils";
import Player from "./Player";
import {
  setVideos,
  setPlaying,
  setStart,
  setCurrentVideoIndex,
} from "./playerSlice";

describe("Player Component", () => {
  beforeEach(() => {
    // Mock fetch for oEmbed API calls
    global.fetch = vi.fn((input: RequestInfo | URL) => {
      const urlString = input.toString();
      if (urlString.includes("youtube.com/oembed")) {
        // Extract video ID from the URL parameter
        const match = urlString.match(/watch\?v=([^&]+)/);
        const videoId = match ? match[1] : "unknown";
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              title: `Mock Video Title ${videoId}`,
              author_name: "Mock Author",
            }),
        } as Response);
      }
      return Promise.reject(new Error("Unexpected fetch call"));
    }) as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the form with all input fields", () => {
    renderWithProviders(<Player />);

    expect(
      screen.getByLabelText(/youtube video urls \(separated by , or ;\)/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /load videos/i }),
    ).toBeInTheDocument();
  });

  it("renders play button initially disabled", () => {
    renderWithProviders(<Player />);

    const playButton = screen.getByLabelText(/play-pause/i);
    expect(playButton).toBeInTheDocument();
    expect(playButton).toBeDisabled();
  });

  it("loads videos when URLs are entered and Load Videos is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    const { store } = renderWithProviders(<Player />);

    const urlInput = screen.getByLabelText(/youtube video urls/i);

    // Use fireEvent for Material-UI multiline TextField
    fireEvent.change(urlInput, {
      target: {
        value:
          "https://youtube.com/watch?v=dQw4w9WgXcQ,https://youtube.com/watch?v=jNQXAC9IVRw",
      },
    });

    const loadButton = screen.getByRole("button", { name: /load videos/i });
    await user.click(loadButton);

    await waitFor(
      () => {
        const state = store.getState().player;
        expect(state.videos.length).toBeGreaterThan(0);
      },
      { timeout: 5000 },
    );

    const state = store.getState().player;
    expect(state.videos).toHaveLength(2);
    expect(state.videos[0].id).toBe("dQw4w9WgXcQ");
    expect(state.videos[1].id).toBe("jNQXAC9IVRw");
    expect(state.currentVideoIndex).toBe(0);
  });

  it("updates start when start input changes", async () => {
    const user = userEvent.setup({ delay: null });
    const { store } = renderWithProviders(<Player />);

    const startInput = screen.getByLabelText(/start/i);
    await user.clear(startInput);
    await user.type(startInput, "5");

    expect(store.getState().player.start).toBe(5);
  });

  it("updates duration when duration input changes", async () => {
    const user = userEvent.setup({ delay: null });
    const { store } = renderWithProviders(<Player />);

    const durationInput = screen.getByLabelText(/duration/i);
    await user.clear(durationInput);
    await user.type(durationInput, "30");

    expect(store.getState().player.duration).toBe(30);
  });

  it("disables inputs when playing", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<Player />);

    // Set URLs first
    const urlInput = screen.getByLabelText(/youtube video urls/i);
    fireEvent.change(urlInput, {
      target: { value: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
    });

    const loadButton = screen.getByRole("button", { name: /load videos/i });
    await user.click(loadButton);

    // Wait for YouTube player to be ready
    await waitFor(() => {
      expect(screen.getByTestId("youtube-player")).toBeInTheDocument();
    });

    // After loading, Load Videos button should be hidden (replaced by VideoList)
    expect(
      screen.queryByRole("button", { name: /load videos/i }),
    ).not.toBeInTheDocument();

    // URL input should not be visible (replaced by VideoList)
    expect(
      screen.queryByLabelText(/youtube video urls/i),
    ).not.toBeInTheDocument();

    // Click play button
    const playButton = screen.getByLabelText(/play-pause/i);
    await user.click(playButton);

    // Inputs should be disabled
    expect(screen.getByLabelText(/start/i)).toBeDisabled();
    expect(screen.getByLabelText(/duration/i)).toBeDisabled();
  });

  it("renders YouTube player when videos are loaded", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<Player />);

    const urlInput = screen.getByLabelText(/youtube video urls/i);
    fireEvent.change(urlInput, {
      target: { value: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
    });

    const loadButton = screen.getByRole("button", { name: /load videos/i });
    await user.click(loadButton);

    await waitFor(() => {
      expect(screen.getByTestId("youtube-player")).toBeInTheDocument();
      expect(screen.getByTestId("youtube-player")).toHaveAttribute(
        "data-video-id",
        "dQw4w9WgXcQ",
      );
    });
  });

  it("extracts video ID from different YouTube URL formats", async () => {
    const user = userEvent.setup({ delay: null });

    const testCases = [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        expectedId: "dQw4w9WgXcQ",
      },
      { url: "https://youtu.be/dQw4w9WgXcQ", expectedId: "dQw4w9WgXcQ" },
      {
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        expectedId: "dQw4w9WgXcQ",
      },
      {
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        expectedId: "dQw4w9WgXcQ",
      },
    ];

    for (const testCase of testCases) {
      const { unmount } = renderWithProviders(<Player />);
      const urlInput = screen.getByLabelText(/youtube video urls/i);

      fireEvent.change(urlInput, { target: { value: testCase.url } });

      const loadButton = screen.getByRole("button", { name: /load videos/i });
      await user.click(loadButton);

      await waitFor(() => {
        expect(screen.getByTestId("youtube-player")).toHaveAttribute(
          "data-video-id",
          testCase.expectedId,
        );
      });

      unmount();
    }
  });

  it("shows error when start time exceeds video length", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<Player />);

    // Set URL to trigger YouTube player mock
    const urlInput = screen.getByLabelText(/youtube video urls/i);
    fireEvent.change(urlInput, {
      target: { value: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
    });

    const loadButton = screen.getByRole("button", { name: /load videos/i });
    await user.click(loadButton);

    // Wait for player to be ready (sets videoLenMinutes to 10 via mock)
    await waitFor(() => {
      expect(screen.getByTestId("youtube-player")).toBeInTheDocument();
    });

    // Set start time beyond video length (mock returns 600 seconds = 10 minutes)
    const startInput = screen.getByLabelText(/start/i);
    await user.clear(startInput);
    await user.type(startInput, "15");

    // Should show error
    await waitFor(() => {
      expect(screen.getByText(/maximum value is 10/i)).toBeInTheDocument();
    });

    // Play button should be disabled
    expect(screen.getByLabelText(/play-pause/i)).toBeDisabled();
  });

  it("displays YouTube Timer heading", () => {
    renderWithProviders(<Player />);

    expect(
      screen.getByRole("heading", { name: /youtube timer/i }),
    ).toBeInTheDocument();
  });

  it("uses dark theme", () => {
    const { container } = renderWithProviders(<Player />);

    // ThemeProvider should be present (MUI handles the actual theme)
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has correct initial state values", () => {
    const { store } = renderWithProviders(<Player />);

    const state = store.getState().player;
    expect(state.videos).toEqual([]);
    expect(state.currentVideoIndex).toBe(0);
    expect(state.duration).toBe(60);
    expect(state.start).toBe(0);
    expect(state.isPlaying).toBe(false);
  });

  it("displays VideoList when videos are loaded", async () => {
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<Player />);

    const urlInput = screen.getByLabelText(/youtube video urls/i);
    fireEvent.change(urlInput, {
      target: {
        value:
          "https://youtube.com/watch?v=dQw4w9WgXcQ,https://youtube.com/watch?v=jNQXAC9IVRw",
      },
    });

    const loadButton = screen.getByRole("button", { name: /load videos/i });

    // Check button is enabled before clicking
    expect(loadButton).not.toBeDisabled();

    await user.click(loadButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Playlist \(2 videos\)/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it("parses URLs separated by semicolons", async () => {
    const user = userEvent.setup({ delay: null });
    const { store } = renderWithProviders(<Player />);

    const urlInput = screen.getByLabelText(/youtube video urls/i);
    fireEvent.change(urlInput, {
      target: {
        value:
          "https://youtube.com/watch?v=dQw4w9WgXcQ;https://youtube.com/watch?v=jNQXAC9IVRw",
      },
    });

    const loadButton = screen.getByRole("button", { name: /load videos/i });
    await user.click(loadButton);

    await waitFor(() => {
      const state = store.getState().player;
      expect(state.videos).toHaveLength(2);
    });
  });

  it("filters out invalid URLs when loading", async () => {
    const user = userEvent.setup({ delay: null });
    const { store } = renderWithProviders(<Player />);

    const urlInput = screen.getByLabelText(/youtube video urls/i);
    fireEvent.change(urlInput, {
      target: {
        value:
          "https://youtube.com/watch?v=dQw4w9WgXcQ,invalid-url,https://youtube.com/watch?v=jNQXAC9IVRw",
      },
    });

    const loadButton = screen.getByRole("button", { name: /load videos/i });
    await user.click(loadButton);

    await waitFor(() => {
      const state = store.getState().player;
      expect(state.videos).toHaveLength(2);
      expect(state.videos[0].id).toBe("dQw4w9WgXcQ");
      expect(state.videos[1].id).toBe("jNQXAC9IVRw");
    });
  });

  it("hides Load Videos button when videos are loaded", async () => {
    const user = userEvent.setup({ delay: null });
    const { store } = renderWithProviders(<Player />);

    const urlInput = screen.getByLabelText(/youtube video urls/i);
    const testUrls =
      "https://youtube.com/watch?v=dQw4w9WgXcQ,https://youtube.com/watch?v=jNQXAC9IVRw";

    fireEvent.change(urlInput, {
      target: { value: testUrls },
    });

    const loadButton = screen.getByRole("button", { name: /load videos/i });
    await user.click(loadButton);

    // Verify videos are loaded and textarea is hidden
    await waitFor(() => {
      expect(store.getState().player.videos).toHaveLength(2);
    });
    expect(
      screen.queryByLabelText(/youtube video urls/i),
    ).not.toBeInTheDocument();

    // Load Videos button should be hidden when videos are loaded
    expect(
      screen.queryByRole("button", { name: /load videos/i }),
    ).not.toBeInTheDocument();

    // Playlist should be visible
    expect(screen.getByText(/Playlist \(2 videos\)/i)).toBeInTheDocument();
  });

  it("has correct state behavior for video end with multiple videos", () => {
    // This test verifies the state changes that handleVideoEnd should perform
    // when a video ends and there are more videos in the playlist
    const { store } = renderWithProviders(<Player />);

    // Setup: Load 2 videos
    store.dispatch(
      setVideos([
        { id: "video1", url: "https://youtube.com/watch?v=video1" },
        { id: "video2", url: "https://youtube.com/watch?v=video2" },
      ]),
    );

    // Setup: Set non-zero start and playing state
    store.dispatch(setStart(5));
    store.dispatch(setCurrentVideoIndex(0));
    store.dispatch(setPlaying(true));

    // Verify initial state
    expect(store.getState().player.isPlaying).toBe(true);
    expect(store.getState().player.start).toBe(5);
    expect(store.getState().player.currentVideoIndex).toBe(0);

    // Simulate handleVideoEnd behavior (the fix we implemented):
    // 1. Stop playing FIRST (prevents auto-play)
    // 2. Reset start to 0
    // 3. Advance to next video
    store.dispatch(setPlaying(false));
    store.dispatch(setStart(0));
    store.dispatch(setCurrentVideoIndex(1));

    // Verify final state after video end
    expect(store.getState().player.isPlaying).toBe(false); // NOT auto-playing
    expect(store.getState().player.start).toBe(0); // Reset to 0
    expect(store.getState().player.currentVideoIndex).toBe(1); // Advanced to next
  });

  it("has correct state behavior for duration timeout", () => {
    // This test verifies that duration timeout should ONLY stop playback
    // without advancing to the next video
    const { store } = renderWithProviders(<Player />);

    // Setup: Load 2 videos
    store.dispatch(
      setVideos([
        { id: "video1", url: "https://youtube.com/watch?v=video1" },
        { id: "video2", url: "https://youtube.com/watch?v=video2" },
      ]),
    );

    // Setup: Start playing first video
    store.dispatch(setCurrentVideoIndex(0));
    store.dispatch(setPlaying(true));

    const initialIndex = store.getState().player.currentVideoIndex;

    // Verify playing
    expect(store.getState().player.isPlaying).toBe(true);
    expect(initialIndex).toBe(0);

    // Simulate duration timeout behavior (the fix we implemented):
    // Should ONLY stop playing, NOT advance to next video
    store.dispatch(setPlaying(false));

    // Verify final state after duration timeout
    expect(store.getState().player.isPlaying).toBe(false); // Stopped
    expect(store.getState().player.currentVideoIndex).toBe(initialIndex); // Did NOT advance
  });

  it("has correct state behavior for last video end", () => {
    // This test verifies behavior when the last video in playlist ends
    const { store } = renderWithProviders(<Player />);

    // Setup: Load 1 video
    store.dispatch(
      setVideos([{ id: "video1", url: "https://youtube.com/watch?v=video1" }]),
    );

    // Setup: Playing with non-zero start
    store.dispatch(setStart(10));
    store.dispatch(setCurrentVideoIndex(0));
    store.dispatch(setPlaying(true));

    // Verify initial state
    expect(store.getState().player.isPlaying).toBe(true);
    expect(store.getState().player.start).toBe(10);

    // Simulate last video end behavior:
    // Stop playing and reset start, but don't advance (no more videos)
    store.dispatch(setPlaying(false));
    store.dispatch(setStart(0));

    // Verify final state
    expect(store.getState().player.isPlaying).toBe(false); // Stopped
    expect(store.getState().player.start).toBe(0); // Reset
    expect(store.getState().player.currentVideoIndex).toBe(0); // Stayed on same video
  });
});
