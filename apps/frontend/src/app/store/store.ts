import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware } from './auth/auth.middleware';

import authReducers from './auth/auth.slice';

export const store = configureStore({
  reducer: {
    auth: authReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
