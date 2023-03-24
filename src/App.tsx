import { ThemeProvider } from '@material-ui/styles';
import { ConfigProvider } from 'antd';
import React, { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
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
import {
  SQLE_DEFAULT_WEB_TITLE,
  SQLE_REDIRECT_KEY_PARAMS_NAME,
} from './data/common';
import { useRequest } from 'ahooks';
import global from './api/global';
import { updateWebTitleAndLog } from './store/system';

//fix  https://github.com/actiontech/sqle/issues/1350
export const Wrapper: React.FC = ({ children }) => {
  const [initRenderApp, setInitRenderApp] = useState<boolean>(true);
  const token = useSelector<IReduxState, string>((state) => state.user.token);
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    if (!initRenderApp) {
      return;
    }
    setInitRenderApp(false);
    if (!token && !['/login', '/user/bind'].includes(location.pathname)) {
      history.replace(
        `/login?${SQLE_REDIRECT_KEY_PARAMS_NAME}=${location.pathname}`
      );
    }
  }, [history, initRenderApp, location.pathname, token]);
  return <>{!initRenderApp && children}</>;
};

function App() {
  const dispatch = useDispatch();
  const token = useSelector<IReduxState, string>((state) => state.user.token);
  const { registerRouter } = useRoutes();
  const { antdLocale } = useLanguage();
  const { currentThemeData } = useChangeTheme();
  const { getUserInfo, getUserInfoLoading } = useUserInfo();

  useRequest(() =>
    global.getSQLEInfoV1().then((res) => {
      const webTitle = res.data.data?.title ?? SQLE_DEFAULT_WEB_TITLE;
      document.title = webTitle;
      dispatch(
        updateWebTitleAndLog({
          webTitle,
          webLogoUrl: res.data.data?.logo_url,
        })
      );
    })
  );

  React.useEffect(() => {
    if (!!token) {
      getUserInfo();
    }
  }, [getUserInfo, token]);

  return (
    <Wrapper>
      <ThemeProvider theme={currentThemeData}>
        <ConfigProvider locale={antdLocale}>
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
        </ConfigProvider>
      </ThemeProvider>
    </Wrapper>
  );
}

export default App;
