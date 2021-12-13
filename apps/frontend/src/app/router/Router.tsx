import { Routes, Route } from 'react-router-dom';

import { AppRoutes } from '../config';
import { Confirm } from '../views/Confirm/Confirm';
import { Dashboard } from '../views/Dashboard/Dashboard';
import { Login } from '../views/Login/Login';
import { NotFound } from '../views/NotFound/NotFound';
import { Registration } from '../views/Registration/Registration';
import { AuthRoute } from './AuthRoute';
import { NonAuthRoute } from './NonAuthRoute';

export const Router: React.FC = () => (
  <Routes>
    <Route
      path={AppRoutes.dashboardRoute['*']}
      element={
        <AuthRoute>
          <Dashboard />
        </AuthRoute>
      }
    />
    <Route
      path={AppRoutes.login}
      element={
        <NonAuthRoute>
          <Login />
        </NonAuthRoute>
      }
    />
    <Route
      path={AppRoutes.registration}
      element={
        <NonAuthRoute>
          <Registration />
        </NonAuthRoute>
      }
    />
    <Route
      path={AppRoutes.confirm}
      element={
        <NonAuthRoute>
          <Confirm />
        </NonAuthRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
