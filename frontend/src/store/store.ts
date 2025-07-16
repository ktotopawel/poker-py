import { configureStore } from '@reduxjs/toolkit';
import gameStateReducer from './slices/gameState.slice';
import modalReducer from './slices/modal.slice';

export const store = configureStore({
  reducer: {
    game: gameStateReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
