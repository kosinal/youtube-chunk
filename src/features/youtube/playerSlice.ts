import { createAppSlice } from "../../app/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  videoUrl: string;
  duration: number;
  start: number;
  delayedStart: number;
  isPlaying: boolean;
  startTime: string;
}

const initialState: AppState = {
  videoUrl: "",
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
    setVideoUrl: create.reducer((state, action: PayloadAction<string>) => {
      state.videoUrl = action.payload;
    }),
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
  }),
  selectors: {
    selectVideoUrl: (state) => state.videoUrl,
    selectDuration: (state) => state.duration,
    selectStart: (state) => state.start,
    selectIsPlaying: (state) => state.isPlaying,
    selectStartTime: (state) => state.startTime,
  },
});

export const { setVideoUrl, setDuration, setStart, setPlaying, setStartTime } =
  playerSlice.actions;
export const {
  selectVideoUrl,
  selectDuration,
  selectStart,
  selectIsPlaying,
  selectStartTime,
} = playerSlice.selectors;
