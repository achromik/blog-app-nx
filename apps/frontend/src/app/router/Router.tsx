import { Routes, Route } from 'react-router-dom';

import { ROUTES } from '../config';
import { Dashboard } from '../views/Dashboard/Dashboard';
import { Login } from '../views/Login/Login';
import { Register } from '../views/Register/Register';
import { AuthRoute } from './AuthRoute';
import { NonAuthRoute } from './NonAuthRoute';

export const Router: React.FC = () => (
  <Routes>
    <Route
      path={ROUTES.dashboardRoute['*']}
      element={
        <AuthRoute>
          <Dashboard />
        </AuthRoute>
      }
    />
    <Route
      path={ROUTES.login}
      element={
        <NonAuthRoute>
          <Login />
        </NonAuthRoute>
      }
    />
    <Route
      path={ROUTES.register}
      element={
        <NonAuthRoute>
          <Register />
        </NonAuthRoute>
      }
    />
  </Routes>
);
