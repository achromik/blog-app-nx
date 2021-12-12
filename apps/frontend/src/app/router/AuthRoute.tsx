import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '../config';
import { useAppSelector } from '../hooks';
import { StoreNamespace } from '../store/types';

interface AuthRouteProps {
  children: JSX.Element;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(
    (state) => state[StoreNamespace.AUTH]
  );

  const location = useLocation();

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to={ROUTES.login} state={{ from: location }} />;
};
