import { Action, Middleware } from '@reduxjs/toolkit';
import { TokenService } from '../../services/token';
import { logOut } from './auth.slice';

export const authMiddleware: Middleware =
  (store) => (next) => (action: Action<string>) => {
    if (logOut.match(action)) {
      TokenService.removeAccessToken();
      TokenService.removeRefreshToken();
    }

    return next(action);
  };
