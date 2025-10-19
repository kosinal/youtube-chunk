import { describe, it, expect } from "vitest";
import {
  playerSlice,
  setVideos,
  setCurrentVideoIndex,
  setDuration,
  setStart,
  setPlaying,
  setStartTime,
  selectVideos,
  selectCurrentVideoIndex,
  selectCurrentVideo,
  selectDuration,
  selectStart,
  selectIsPlaying,
  selectStartTime,
} from "./playerSlice";
import type { Video } from "./playerSlice";

describe("playerSlice", () => {
  const initialState = {
    videos: [],
    currentVideoIndex: 0,
    duration: 60,
    start: 0,
    delayedStart: 0,
    isPlaying: false,
    startTime: expect.any(String),
  };

  describe("reducers", () => {
    it("should return initial state", () => {
      const state = playerSlice.reducer(undefined, { type: "unknown" });

      expect(state).toMatchObject({
        videos: [],
        currentVideoIndex: 0,
        duration: 60,
        start: 0,
        isPlaying: false,
      });
    });

    it("should handle setVideos", () => {
      const testVideos: Video[] = [
        {
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          id: "dQw4w9WgXcQ",
        },
        { url: "https://www.youtube.com/watch?v=abc123", id: "abc123" },
      ];
      const state = playerSlice.reducer(initialState, setVideos(testVideos));

      expect(state.videos).toEqual(testVideos);
      expect(state.currentVideoIndex).toBe(0);
    });

    it("should handle setCurrentVideoIndex", () => {
      const testVideos: Video[] = [
        {
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          id: "dQw4w9WgXcQ",
        },
        { url: "https://www.youtube.com/watch?v=abc123", id: "abc123" },
      ];
      let state = playerSlice.reducer(initialState, setVideos(testVideos));
      state = playerSlice.reducer(state, setCurrentVideoIndex(1));

      expect(state.currentVideoIndex).toBe(1);
    });

    it("should handle setDuration", () => {
      const state = playerSlice.reducer(initialState, setDuration(120));

      expect(state.duration).toBe(120);
    });

    it("should handle setStart", () => {
      const state = playerSlice.reducer(initialState, setStart(30));

      expect(state.start).toBe(30);
    });

    it("should handle setPlaying", () => {
      const state = playerSlice.reducer(initialState, setPlaying(true));

      expect(state.isPlaying).toBe(true);

      const state2 = playerSlice.reducer(state, setPlaying(false));
      expect(state2.isPlaying).toBe(false);
    });

    it("should handle setStartTime", () => {
      const testTime = "2024-01-15T10:30:00.000Z";
      const state = playerSlice.reducer(initialState, setStartTime(testTime));

      expect(state.startTime).toBe(testTime);
    });

    it("should handle multiple actions sequentially", () => {
      const testVideos: Video[] = [
        { url: "https://youtube.com/test", id: "test123" },
      ];
      let state = playerSlice.reducer(initialState, setVideos(testVideos));
      state = playerSlice.reducer(state, setDuration(90));
      state = playerSlice.reducer(state, setStart(15));
      state = playerSlice.reducer(state, setPlaying(true));

      expect(state).toMatchObject({
        videos: testVideos,
        currentVideoIndex: 0,
        duration: 90,
        start: 15,
        isPlaying: true,
      });
    });
  });

  describe("selectors", () => {
    const testVideos: Video[] = [
      { url: "https://youtube.com/watch?v=test123", id: "test123" },
      { url: "https://youtube.com/watch?v=abc456", id: "abc456" },
    ];

    const mockState = {
      player: {
        videos: testVideos,
        currentVideoIndex: 0,
        duration: 45,
        start: 10,
        delayedStart: 0,
        isPlaying: true,
        startTime: "2024-01-15T12:00:00.000Z",
      },
    };

    it("selectVideos should return videos array", () => {
      expect(selectVideos(mockState)).toEqual(testVideos);
    });

    it("selectCurrentVideoIndex should return current index", () => {
      expect(selectCurrentVideoIndex(mockState)).toBe(0);
    });

    it("selectCurrentVideo should return current video", () => {
      expect(selectCurrentVideo(mockState)).toEqual(testVideos[0]);
    });

    it("selectCurrentVideo should return null when no videos", () => {
      const emptyState = {
        player: {
          ...mockState.player,
          videos: [],
        },
      };
      expect(selectCurrentVideo(emptyState)).toBe(null);
    });

    it("selectDuration should return duration", () => {
      expect(selectDuration(mockState)).toBe(45);
    });

    it("selectStart should return start time", () => {
      expect(selectStart(mockState)).toBe(10);
    });

    it("selectIsPlaying should return playing state", () => {
      expect(selectIsPlaying(mockState)).toBe(true);
    });

    it("selectStartTime should return start timestamp", () => {
      expect(selectStartTime(mockState)).toBe("2024-01-15T12:00:00.000Z");
    });
  });
});
