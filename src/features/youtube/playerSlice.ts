import { createAppSlice } from "../../app/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  videoUrl: string;
  duration: number;
  start: number;
  delayedStart: number;
  isPlaying: boolean;
}

const initialState: AppState = {
  videoUrl: "",
  duration: 60,
  start: 0,
  delayedStart: 0,
  isPlaying: false,
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
    setDelayedStart: create.reducer((state, action: PayloadAction<number>) => {
      state.delayedStart = action.payload;
    }),
    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
  }),
  selectors: {
    selectVideoUrl: (state) => state.videoUrl,
    selectDuration: (state) => state.duration,
    selectStart: (state) => state.start,
    selectDelayedStart: (state) => state.delayedStart,
    selectIsPlaying: (state) => state.isPlaying,
  },
});

export const { setVideoUrl, setDuration, setStart, setPlaying, setDelayedStart } =
  playerSlice.actions;
export const { selectVideoUrl, selectDuration, selectStart, selectIsPlaying, selectDelayedStart } =
  playerSlice.selectors;
