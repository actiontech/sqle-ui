import { ThemeProvider } from '@material-ui/styles';
import { ConfigProvider } from 'antd';
import React, { ReactNodeArray } from 'react';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import HeaderProgress from './components/HeaderProgress';
import Nav from './components/Nav';
import useChangeTheme from './hooks/useChangeTheme';
import useLanguage from './hooks/useLanguage';
import { routerConfig, unAuthRouter } from './router/config';
import { IReduxState } from './store';
import { RouterItem } from './types/router.type';

function App() {
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const { antdLocale } = useLanguage();
  const { currentThemeData } = useChangeTheme();

  const registerRouter = React.useCallback(
    (config: RouterItem[]): ReactNodeArray => {
      return config.map((route) => {
        if (route.components) {
          return registerRouter(route.components);
        }
        return <Route {...route} />;
      });
    },
    []
  );

  return (
    <ThemeProvider theme={currentThemeData}>
      <ConfigProvider locale={antdLocale}>
        <Router>
          <Suspense fallback={<HeaderProgress />}>
            {!username && (
              <Switch>
                {unAuthRouter.map((route) => {
                  return <Route {...route} />;
                })}
                <Redirect to="/login" />
              </Switch>
            )}
            {!!username && (
              <Nav>
                <Switch>
                  {registerRouter(routerConfig)}
                  <Redirect to="/" />
                </Switch>
              </Nav>
            )}
          </Suspense>
        </Router>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
