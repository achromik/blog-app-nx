import Axios, { AxiosError, AxiosRequestHeaders } from 'axios';

import { api } from '../../config';
import { refreshToken } from '../../store/auth/auth.actions';
import { logOut } from '../../store/auth/auth.slice';
import { store } from '../../store/store';
import { TokenService } from '../token';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
  PUT = 'put',
  DELETE = 'delete',
}

const MAX_RETRY = 1;

const { dispatch } = store;

export const axios = Axios.create({
  baseURL: api.baseURL,
});

const getHeaders = (): AxiosRequestHeaders => {
  const token = TokenService.getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return headers;
};

const executeQuery = async <ResponseData, Body>(
  method: HttpMethod,
  url: string,
  query: string | undefined,
  body: Body | undefined = undefined,
  retryCount = 0
): Promise<ResponseData> => {
  if (retryCount > MAX_RETRY) {
    dispatch(logOut());
    throw new Error('MAX_RETRY_EXCEEDED');
  }
  try {
    const { data } = (await axios(url, {
      method,
      params: query,
      data: body,
      headers: getHeaders(),
    })) as { data: ResponseData };

    return data;
  } catch (err) {
    if (
      (err as AxiosError).response?.status === 401 &&
      retryCount !== MAX_RETRY &&
      url !== api.endpoints.auth.login
    ) {
      await dispatch(refreshToken());
      return executeQuery(method, url, query, body, retryCount + 1);
    }

    throw err;
  }
};

const get = <T>(url: string, query: string | undefined = undefined) =>
  executeQuery<T, never>(HttpMethod.GET, url, query);

const post = <T, Body = any>(url: string, body: Body) =>
  executeQuery<T, Body>(HttpMethod.POST, url, undefined, body);

export const http = {
  get,
  post,
};