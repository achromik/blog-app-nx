import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { LoginData, AuthResponse, ErrorResponse, Tokens } from '@libs/types';
import { http } from '../../services/http';
import { api } from '../../config';
import { TokenService } from '../../services/token';

export const logIn = createAsyncThunk<
  Tokens,
  LoginData,
  { rejectValue: string }
>('auth/logIn', async ({ email, password }, thunkAPI) => {
  try {
    const url = api.endpoints.auth.login;
    const {
      data: {
        payload: { accessToken, refreshToken },
      },
    } = await http.post<AuthResponse, any>(url, {
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
>('auth/refreshToken', async (_, thunkAPI) => {
  try {
    const url = api.endpoints.auth.refresh;

    const refreshToken = TokenService.getRefreshToken();

    const {
      data: { payload },
    } = await http.post<any, any>(url, { refreshToken });

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
