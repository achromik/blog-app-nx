import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '../config';
import { useAppSelector } from '../hooks';
import { StoreNamespace } from '../store/types';

interface NonAuthRouteProps {
  children: JSX.Element;
}

export const NonAuthRoute: React.FC<NonAuthRouteProps> = ({ children }) => {
  const location = useLocation();

  const { isAuthenticated } = useAppSelector(
    (state) => state[StoreNamespace.AUTH]
  );

  // const dashboard = user?.role === Role.STUDENT ? routes.STUDENT_DASHBOARD : routes.TEACHER_DASHBOARD;

  if (isAuthenticated) {
    return (
      <Navigate
        to={location.state?.from?.pathname ?? ROUTES.dashboardRoute.index}
        state={{ from: location }}
      />
    );
  }

  return children;
};
