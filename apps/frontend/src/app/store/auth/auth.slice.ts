import { createSlice } from '@reduxjs/toolkit';

import { Tokens } from '@libs/types';
import { TokenService } from '../../services/token';
import {
  AuthState,
  AsyncActionStatus,
  ActionTypePrefix,
  StoreNamespace,
} from '../types';
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
  name: StoreNamespace.AUTH,
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
    setIsRegistered: (state, { payload }: { payload: boolean }) => ({
      ...state,
      isRegistered: payload,
    }),
  },
  extraReducers: (build) => {
    build.addMatcher(isPendingAction(ActionTypePrefix.AUTH_LOGIN), (state) => ({
      ...state,
      status: AsyncActionStatus.PENDING,
      error: '',
    }));

    build.addMatcher(
      isFulfilledAction<Tokens>(ActionTypePrefix.AUTH_LOGIN),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.FULFILLED,
        isAuthenticated: true,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      })
    );

    build.addMatcher(
      isRejectedAction<string>(ActionTypePrefix.AUTH_LOGIN),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.REJECTED,
        isAuthenticated: false,
        error: payload,
      })
    );

    build.addMatcher(
      isPendingAction(ActionTypePrefix.AUTH_REFRESH_TOKEN),
      (state) => ({
        ...state,
        status: AsyncActionStatus.PENDING,
        error: '',
        isAuthenticated: false,
      })
    );

    build.addMatcher(
      isFulfilledAction<Tokens>(ActionTypePrefix.AUTH_REFRESH_TOKEN),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.FULFILLED,
        isAuthenticated: true,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      })
    );

    build.addMatcher(
      isRejectedAction<string>(ActionTypePrefix.AUTH_REFRESH_TOKEN),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.REJECTED,
        isAuthenticated: false,
        error: payload,
      })
    );

    build.addMatcher(
      isPendingAction(ActionTypePrefix.AUTH_REGISTER),
      (state) => ({
        ...state,
        status: AsyncActionStatus.PENDING,
        error: '',
        isRegistered: false,
      })
    );

    build.addMatcher(
      isFulfilledAction(ActionTypePrefix.AUTH_REGISTER),
      (state) => ({
        ...state,
        status: AsyncActionStatus.FULFILLED,
        isRegistered: true,
      })
    );

    build.addMatcher(
      isRejectedAction<string>(ActionTypePrefix.AUTH_REGISTER),
      (state, { payload }) => ({
        ...state,
        status: AsyncActionStatus.REJECTED,
        error: payload,
      })
    );
  },
});

export const { clearAuthError, logOut, setIsRegistered } = authSlice.actions;

export default authSlice.reducer;
