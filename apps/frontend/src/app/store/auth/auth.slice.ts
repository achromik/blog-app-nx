import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '../../types';
import { logIn } from './auth.actions';

const token = localStorage.getItem('token');

const initialState: AuthState = {
  status: 'idle',
  isAuthenticated: token ? true : false,
  token: token ?? '',
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (build) => {
    build.addCase(logIn.pending, (state) => {
      state.status = 'pending';
    });

    build.addCase(logIn.fulfilled, (state, { payload }) => {
      state.status = 'resolved';
      state.isAuthenticated = true;
      state.token = payload;
    });

    build.addCase(logIn.rejected, (state, { payload, error }) => {
      state.status = 'resolved';
      state.isAuthenticated = false;
      if (payload) {
        state.error = payload;
      } else {
        state.error = error.message as string;
      }
    });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
