import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { LoginData, LoginUserResponse, ErrorResponse } from '@libs/types';
import { http } from 'utils/http';
import { api } from 'config';

export const logIn = createAsyncThunk<
  string,
  LoginData,
  { rejectValue: string }
>('auth/logIn', async ({ email, password }, thunkAPI) => {
  try {
    const url = api.endpoints.auth.login;
    const {
      data: { access_token },
    } = await http.post<LoginUserResponse>(url, {
      email,
      password,
    });

    localStorage.setItem('token', access_token);

    return access_token;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      (err as AxiosError<ErrorResponse>).response?.data.message ??
        'Unknown Error!'
    );
  }
});
