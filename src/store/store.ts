import { configureStore } from '@reduxjs/toolkit';
import jobSearchReducer from './slices/jobSearchSlice';

export const store = configureStore({
  reducer: {
    jobSearch: jobSearchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 