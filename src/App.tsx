import { ThemeProvider } from '@material-ui/styles';
import { Spin } from 'antd';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { routerConfig, unAuthRouter } from './router/config';
import { IReduxState } from './store';
import lightTheme from './theme/light';

function App() {
  const username = useSelector((state: IReduxState) => state.user.username);
  return (
    <ThemeProvider theme={lightTheme}>
      <Router>
        <Suspense fallback={<Spin spinning={true} />}>
          {!username && (
            <Switch>
              {unAuthRouter.map((route) => {
                return <Route path={route.path} component={route.component} />;
              })}
              <Redirect to="/login" />
            </Switch>
          )}
          {!!username && (
            <Switch>
              {routerConfig.map((route) => {
                return <Route path={route.path} component={route.component} />;
              })}
            </Switch>
          )}
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
