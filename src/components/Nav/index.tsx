import { Spin } from 'antd';
import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { routerConfig } from '../../router/config';

const Nav: React.FC = (props: any) => {
  React.useEffect(() => {
    console.log('mount');
    return () => {
      console.log('unmonut');
    };
  }, []);

  const location = useLocation();

  const currentRouter = routerConfig.find(
    (item) => item.path === location.pathname
  );

  if (currentRouter) {
    return null;
  }

  return (
    <div>
      nav page{props.children}
      {JSON.stringify(props.routes)}
      <Switch>
        <Suspense fallback={<Spin spinning={true} />}>
          {props.routes.map((route: any) => {
            return <Route key={route.path} path={route} />;
          })}
        </Suspense>
      </Switch>
    </div>
  );
};

export default Nav;
