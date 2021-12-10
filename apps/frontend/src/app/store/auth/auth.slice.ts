import { createSlice } from '@reduxjs/toolkit';

import { Tokens } from '@libs/types';
import { TokenService } from '../../services/token';
import { AuthState, AsyncActionStatus, actionTypePrefix } from '../types';
import { isFulfilledAction, isPendingAction, isRejectedAction } from '../utils';

const tokens: Tokens = {
  accessToken: TokenService.getAccessToken(),
  refreshToken: TokenService.getRefreshToken(),
};

const initialState: AuthState = {
  status: AsyncActionStatus.IDLE,
  isAuthenticated: tokens.accessToken ? true : false,
  isRegistered: false,
  ...tokens,
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => ({
      ...state,
      error: '',
    }),
    logOut: (state) => ({
      ...state,
      isAuthenticated: false,
      accessToken: '',
    }),
  },
  extraReducers: (build) => {
    build.addMatcher(isPendingAction(actionTypePrefix.AUTH_LOGIN), (state) => ({
      ...state,
      status: AsyncActionStatus.PENDING,
    }));

    build.addMatcher(
      isFulfilledAction<Tokens>(actionTypePrefix.AUTH_LOGIN),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.FULFILLED,
        isAuthenticated: true,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      })
    );

    build.addMatcher(
      isRejectedAction<string>(actionTypePrefix.AUTH_LOGIN),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.REJECTED,
        isAuthenticated: false,
        error: payload,
      })
    );

    build.addMatcher(
      isPendingAction(actionTypePrefix.AUTH_REFRESH_TOKEN),
      (state) => ({
        ...state,
        status: AsyncActionStatus.PENDING,
        isAuthenticated: false,
      })
    );

    build.addMatcher(
      isFulfilledAction<Tokens>(actionTypePrefix.AUTH_REFRESH_TOKEN),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.FULFILLED,
        isAuthenticated: true,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      })
    );

    build.addMatcher(
      isRejectedAction<string>(actionTypePrefix.AUTH_REFRESH_TOKEN),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.REJECTED,
        isAuthenticated: false,
        error: payload,
      })
    );

    build.addMatcher(
      isPendingAction(actionTypePrefix.AUTH_REGISTER),
      (state) => ({
        ...state,
        status: AsyncActionStatus.PENDING,
        isRegistered: false,
      })
    );

    build.addMatcher(
      isFulfilledAction(actionTypePrefix.AUTH_REGISTER),
      (state) => ({
        ...state,
        status: AsyncActionStatus.FULFILLED,
        isRegistered: true,
      })
    );

    build.addMatcher(
      isRejectedAction<string>(actionTypePrefix.AUTH_REGISTER),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.REJECTED,
        error: payload,
      })
    );
  },
});

export const { clearAuthError, logOut } = authSlice.actions;

export default authSlice.reducer;
