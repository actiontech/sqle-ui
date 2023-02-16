import { ThemeProvider } from '@material-ui/styles';
import { ConfigProvider } from 'antd';
import React from 'react';
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
import { globalRouterConfig, unAuthRouter } from './router/config';
import { IReduxState } from './store';
import EmptyBox from './components/EmptyBox';
import useRoutes from './hooks/useRoutes';
import useUserInfo from './hooks/useUserInfo';

function App() {
  const token = useSelector<IReduxState, string>((state) => state.user.token);
  const { registerRouter } = useRoutes();
  const { antdLocale } = useLanguage();
  const { currentThemeData } = useChangeTheme();
  const { getUserInfo, getUserInfoLoading } = useUserInfo();

  React.useEffect(() => {
    if (!!token) {
      getUserInfo();
    }
  }, [getUserInfo, token]);

  return (
    <ThemeProvider theme={currentThemeData}>
      <ConfigProvider locale={antdLocale}>
        <Router>
          <Suspense fallback={<HeaderProgress />}>
            {!getUserInfoLoading && !token && (
              <>
                <Switch>
                  {unAuthRouter.map((route) => {
                    return <Route {...route} key={route.key} />;
                  })}
                  <Redirect to="/login" />
                </Switch>
              </>
            )}
            {!!token && (
              <Nav>
                <Suspense fallback={<HeaderProgress />}>
                  <EmptyBox if={!getUserInfoLoading}>
                    <Switch>
                      {registerRouter(globalRouterConfig)}
                      <Redirect to="/" />
                    </Switch>
                  </EmptyBox>
                </Suspense>
              </Nav>
            )}
          </Suspense>
        </Router>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
