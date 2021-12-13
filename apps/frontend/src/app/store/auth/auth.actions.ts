import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  LoginRequestPayload,
  AuthResponse,
  ErrorResponse,
  Tokens,
  RefreshTokenRequestPayload,
  RegistrationRequestPayload,
  User,
  RegistrationResponse,
} from '@libs/types';
import { http } from '../../services/http';
import { api } from '../../config';
import { TokenService } from '../../services/token';
import { ActionTypePrefix } from '../types';

export const logIn = createAsyncThunk<
  Tokens,
  LoginRequestPayload,
  { rejectValue: string }
>(ActionTypePrefix.AUTH_LOGIN, async ({ email, password }, thunkAPI) => {
  try {
    const url = api.endpoints.auth.login;
    const {
      data: {
        payload: { accessToken, refreshToken },
      },
    } = await http.post<AuthResponse, LoginRequestPayload>(url, {
      email,
      password,
    });

    TokenService.setAccessToken(accessToken);
    TokenService.setRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  } catch (err) {
    return thunkAPI.rejectWithValue(
      (err as AxiosError<ErrorResponse>).response?.data.message ??
        'Unknown Error!'
    );
  }
});

export const refreshToken = createAsyncThunk<
  Tokens,
  undefined,
  { rejectValue: string }
>(ActionTypePrefix.AUTH_REFRESH_TOKEN, async (_, thunkAPI) => {
  try {
    const url = api.endpoints.auth.refresh;

    const refreshToken = TokenService.getRefreshToken();

    const {
      data: { payload },
    } = await http.post<AuthResponse, RefreshTokenRequestPayload>(url, {
      refreshToken,
    });

    TokenService.setAccessToken(payload.accessToken);
    TokenService.setRefreshToken(payload.refreshToken);

    return payload;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      (err as AxiosError<ErrorResponse>).response?.data.message ??
        'Unknown Error!'
    );
  }
});

export const register = createAsyncThunk<
  User,
  RegistrationRequestPayload,
  { rejectValue: string }
>(ActionTypePrefix.AUTH_REGISTER, async (userRegisterPayload, thunkAPI) => {
  try {
    const url = api.endpoints.auth.register;

    const {
      data: { user },
    } = await http.post<RegistrationResponse, RegistrationRequestPayload>(
      url,
      userRegisterPayload
    );

    return user;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      (err as AxiosError<ErrorResponse>).response?.data.message ??
        'Unknown error'
    );
  }
});

export const confirm = createAsyncThunk<
  boolean,
  { confirmToken: string },
  { rejectValue: string }
>(ActionTypePrefix.AUTH_CONFIRM, async ({ confirmToken }, thunkAPI) => {
  try {
    const url = api.endpoints.auth.confirm;

    await http.get(url, { token: confirmToken });

    return true;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      (err as AxiosError<ErrorResponse>).response?.data.message ??
        'Unknown error'
    );
  }
});
