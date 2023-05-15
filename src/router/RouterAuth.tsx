import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { IReduxState } from '../store';
import { SQLE_BASE_URL } from '../data/common';
import { globalRouterConfig } from './config';

const RouterAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const role = useSelector((state: IReduxState) => state.user.role);

  const location = useLocation();

  const currentRouter = globalRouterConfig.find(
    (v) => `${SQLE_BASE_URL}${v.path}` === location.pathname
  );

  if (currentRouter?.role && !currentRouter.role.includes(role)) {
    return (
      <Navigate
        to={`${SQLE_BASE_URL}home`}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default RouterAuth;
