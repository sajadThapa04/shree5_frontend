import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./rootReducers/rootReducers";
import {logger} from "../utils/reduxLogger";
import {loadUserStateFromLocalStorage, saveUserStateToLocalStorage} from "../utils/localStorageUtils";

// Load initial state from localStorage
const persistedState = loadUserStateFromLocalStorage();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  middleware: getDefaultMiddleware => process.env.NODE_ENV === "development"
    ? getDefaultMiddleware().concat(logger)
    : getDefaultMiddleware()
});

// Subscribe to store changes
store.subscribe(() => {
  const state = store.getState();
  saveUserStateToLocalStorage({userInfo: state.user.userInfo, accessToken: state.user.accessToken, refreshToken: state.user.refreshToken, isAuthenticated: state.user.isAuthenticated, isEmailVerified: state.user.isEmailVerified});
});