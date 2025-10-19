import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { playerSlice } from "../components/Player/playerSlice";
import type { RootState } from "../app/store";

// This type interface extends the default options for render from RTL
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof setupStore>;
}

// Create a test store function - matches the production store config
export function setupStore(preloadedState?: Partial<RootState>) {
  const rootReducer = combineSlices(playerSlice);
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
}

// Custom render function that includes Redux Provider
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from React Testing Library
/* eslint-disable react-refresh/only-export-components */
export * from "@testing-library/react";
export { renderWithProviders as render };
