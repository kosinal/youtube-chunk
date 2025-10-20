import { createAppSlice } from "../../app/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Video {
  url: string;
  id: string;
  title?: string;
}

interface AppState {
  videos: Video[];
  currentVideoIndex: number;
  duration: number;
  start: number;
  delayedStart: number;
  isPlaying: boolean;
  startTime: string;
}

const initialState: AppState = {
  videos: [],
  currentVideoIndex: 0,
  duration: 60,
  start: 0,
  delayedStart: 0,
  isPlaying: false,
  startTime: new Date().toISOString(),
};

export const playerSlice = createAppSlice({
  name: "player",
  initialState,
  reducers: (create) => ({
    setVideos: create.reducer((state, action: PayloadAction<Video[]>) => {
      state.videos = action.payload;
      state.currentVideoIndex = 0;
    }),
    setCurrentVideoIndex: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.currentVideoIndex = action.payload;
      },
    ),
    setDuration: create.reducer((state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    }),
    setStart: create.reducer((state, action: PayloadAction<number>) => {
      state.start = action.payload;
    }),
    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setStartTime(state, action: PayloadAction<string>) {
      state.startTime = action.payload;
    },
    removeVideo: create.reducer((state, action: PayloadAction<number>) => {
      const indexToRemove = action.payload;
      state.videos = state.videos.filter((_, index) => index !== indexToRemove);

      // Adjust currentVideoIndex if needed
      if (state.currentVideoIndex >= state.videos.length) {
        state.currentVideoIndex = Math.max(0, state.videos.length - 1);
      } else if (indexToRemove < state.currentVideoIndex) {
        state.currentVideoIndex -= 1;
      }
    }),
  }),
  selectors: {
    selectVideos: (state) => state.videos,
    selectCurrentVideoIndex: (state) => state.currentVideoIndex,
    selectCurrentVideo: (state) =>
      state.videos[state.currentVideoIndex] || null,
    selectDuration: (state) => state.duration,
    selectStart: (state) => state.start,
    selectIsPlaying: (state) => state.isPlaying,
    selectStartTime: (state) => state.startTime,
  },
});

export const {
  setVideos,
  setCurrentVideoIndex,
  setDuration,
  setStart,
  setPlaying,
  setStartTime,
  removeVideo,
} = playerSlice.actions;
export const {
  selectVideos,
  selectCurrentVideoIndex,
  selectCurrentVideo,
  selectDuration,
  selectStart,
  selectIsPlaying,
  selectStartTime,
} = playerSlice.selectors;
