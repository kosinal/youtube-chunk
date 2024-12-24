import type { Action, ThunkAction, MiddlewareAPI, Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { playerSlice } from "../features/youtube/playerSlice"
import logger from 'redux-logger'

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices(playerSlice)
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>

// Middleware to sync the store with local storage
const localStorageMiddleware = (storeAPI: MiddlewareAPI<Dispatch<UnknownAction>>) => (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
    const result = next(action);
    const state = storeAPI.getState();
    localStorage.setItem("reduxState", JSON.stringify(state));
    return result;
};

// Function to load the state from local storage
const loadStateFromLocalStorage = (): Partial<RootState> => {
    try {
        const serializedState = localStorage.getItem("reduxState");
        if (serializedState === null) {
            return {};
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.error("Could not load state from local storage", e);
        return {};
    }
};

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
    const store = configureStore({
        reducer: rootReducer,
        preloadedState: preloadedState || loadStateFromLocalStorage(),
        // @ts-expect-error Typing with local storage problem
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, localStorageMiddleware),
    });

    // configure listeners using the provided defaults
    // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
    setupListeners(store.dispatch);
    return store;
};

export const store = makeStore()

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
