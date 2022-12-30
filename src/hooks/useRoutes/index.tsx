import { ReactNodeArray, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { SystemRole } from '../../data/common';
import { IReduxState } from '../../store';
import { RouterItem } from '../../types/router.type';

const useRoutes = () => {
  const role = useSelector<IReduxState, SystemRole | ''>(
    (state) => state.user.role
  );

  const registerRouter: <T extends string>(
    routers: RouterItem<T>[]
  ) => ReactNodeArray = useCallback(
    (routers) => {
      return routers.map((route) => {
        if (Array.isArray(route.role) && !route.role.includes(role)) {
          return null;
        }
        if (route.components) {
          return registerRouter(route.components);
        }

        if (route.groups) {
          const components = route.groups?.reduce<RouterItem<string>[]>(
            (acc, cur) => [...acc, ...cur.values],
            []
          );
          return registerRouter(components);
        }
        return <Route {...route} path={route.path} />;
      });
    },
    [role]
  );

  return { registerRouter };
};

export default useRoutes;
