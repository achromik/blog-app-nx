import { createSlice } from '@reduxjs/toolkit';

import { Tokens } from '@libs/types';
import { TokenService } from '../../services/token';
import { AuthState } from '../../types';
import { isFulfilledAction, isPendingAction, isRejectedAction } from '../utils';
import { logIn, refreshToken } from './auth.actions';

const tokens: Tokens = {
  accessToken: TokenService.getAccessToken(),
  refreshToken: TokenService.getRefreshToken(),
};

const initialState: AuthState = {
  status: 'idle',
  isAuthenticated: tokens.accessToken ? true : false,
  ...tokens,
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = '';
    },
    logOut: (state) => {
      state.isAuthenticated = false;
      state.accessToken = '';
    },
  },
  extraReducers: (build) => {
    build.addMatcher(isPendingAction<never>(logIn.typePrefix), (state) => {
      state.status = 'pending';
    });

    build.addMatcher(
      isFulfilledAction<Tokens>(logIn.typePrefix),
      (state, { payload }) => {
        state.status = 'resolved';
        state.isAuthenticated = true;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
      }
    );

    build.addMatcher(
      isRejectedAction<string | Error>(logIn.typePrefix),
      (state, { payload, error }) => {
        state.status = 'resolved';
        state.isAuthenticated = false;
        if (typeof payload === 'string') {
          state.error = payload;
        }
        if (error instanceof Error) {
          state.error = error.message;
        }
      }
    );

    build.addMatcher(
      isPendingAction<never>(refreshToken.typePrefix),
      (state) => {
        state.status = 'pending';
      }
    );

    build.addMatcher(
      isFulfilledAction<Tokens>(refreshToken.typePrefix),
      (state, { payload }) => {
        state.status = 'resolved';
        state.isAuthenticated = true;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
      }
    );

    build.addMatcher(
      isRejectedAction<string | Error>(refreshToken.typePrefix),
      (state, { error }) => {
        state.status = 'resolved';
        state.isAuthenticated = false;

        if (error instanceof Error) {
          state.error = error.message;
        }
      }
    );
  },
});

export const { clearAuthError, logOut } = authSlice.actions;

export default authSlice.reducer;
