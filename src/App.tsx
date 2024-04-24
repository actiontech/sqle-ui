import { StyledEngineProvider } from '@mui/material/styles';
import { ConfigProvider } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useRoutes } from 'react-router-dom';
import HeaderProgress from './components/HeaderProgress';
import Nav from './components/Nav';
import useChangeTheme from './hooks/useChangeTheme';
import useLanguage from './hooks/useLanguage';
import { globalRouterConfig, unAuthRouter } from './router/config';
import { IReduxState } from './store';
import EmptyBox from './components/EmptyBox';
import useUserInfo from './hooks/useUserInfo';
import {
  SQLE_DEFAULT_WEB_TITLE,
  SQLE_REDIRECT_KEY_PARAMS_NAME,
  SQLE_COOKIE_TOKEN_KEY_NAME,
} from './data/common';
import { useRequest } from 'ahooks';
import global from './api/global';
import { updateWebTitleAndLog } from './store/system';
import useNavigate from './hooks/useNavigate';
import { ThemeProvider } from '@mui/system';
import RouterAuth from './router/RouterAuth';
import { getCookie } from './utils/Common';
import { updateToken } from './store/user';

//fix  https://github.com/actiontech/sqle/issues/1350
export const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [initRenderApp, setInitRenderApp] = useState<boolean>(true);
  const token = useSelector<IReduxState, string>((state) => state.user.token);
  const location = useLocation();
  const history = useNavigate();
  useEffect(() => {
    if (!initRenderApp) {
      return;
    }
    setInitRenderApp(false);
    if (!token && !['/login', '/user/bind'].includes(location.pathname)) {
      history(`/login?${SQLE_REDIRECT_KEY_PARAMS_NAME}=${location.pathname}`);
    }
  }, [history, initRenderApp, location.pathname, token]);
  return <>{!initRenderApp && children}</>;
};

function App() {
  const dispatch = useDispatch();
  dispatch(updateToken({ token: getCookie(SQLE_COOKIE_TOKEN_KEY_NAME) }));

  const token = useSelector<IReduxState, string>((state) => state.user.token);
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

  const elements = useRoutes(token ? globalRouterConfig : unAuthRouter);
  return (
    <Wrapper>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={currentThemeData}>
          <ConfigProvider locale={antdLocale}>
            <Suspense fallback={<HeaderProgress />}>
              {!getUserInfoLoading && !token && <>{elements}</>}
              {!!token && (
                <Nav>
                  <Suspense fallback={<HeaderProgress />}>
                    <EmptyBox if={!getUserInfoLoading}>
                      <RouterAuth>{elements}</RouterAuth>
                    </EmptyBox>
                  </Suspense>
                </Nav>
              )}
            </Suspense>
          </ConfigProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Wrapper>
  );
}

export default App;
