import { describe, it, expect } from "vitest";
import {
  playerSlice,
  setVideoUrl,
  setDuration,
  setStart,
  setPlaying,
  setStartTime,
  selectVideoUrl,
  selectDuration,
  selectStart,
  selectIsPlaying,
  selectStartTime,
} from "./playerSlice";

describe("playerSlice", () => {
  const initialState = {
    videoUrl: "",
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
        videoUrl: "",
        duration: 60,
        start: 0,
        isPlaying: false,
      });
    });

    it("should handle setVideoUrl", () => {
      const testUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const state = playerSlice.reducer(initialState, setVideoUrl(testUrl));

      expect(state.videoUrl).toBe(testUrl);
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
      let state = playerSlice.reducer(initialState, setVideoUrl("https://youtube.com/test"));
      state = playerSlice.reducer(state, setDuration(90));
      state = playerSlice.reducer(state, setStart(15));
      state = playerSlice.reducer(state, setPlaying(true));

      expect(state).toMatchObject({
        videoUrl: "https://youtube.com/test",
        duration: 90,
        start: 15,
        isPlaying: true,
      });
    });
  });

  describe("selectors", () => {
    const mockState = {
      player: {
        videoUrl: "https://youtube.com/watch?v=test123",
        duration: 45,
        start: 10,
        delayedStart: 0,
        isPlaying: true,
        startTime: "2024-01-15T12:00:00.000Z",
      },
    };

    it("selectVideoUrl should return video URL", () => {
      expect(selectVideoUrl(mockState)).toBe("https://youtube.com/watch?v=test123");
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
