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
import { useRequest } from 'ahooks';
import { ResponseCode, SystemRole } from './data/common';
import { updateUser, updateToken } from './store/user';
import user from './api/user';
import { useDispatch } from 'react-redux';
import EmptyBox from './components/EmptyBox';

function App() {
  const token = useSelector<IReduxState, string>((state) => state.user.token);
  const role = useSelector<IReduxState, SystemRole | ''>(
    (state) => state.user.role
  );
  const { antdLocale } = useLanguage();
  const { currentThemeData } = useChangeTheme();
  const dispatch = useDispatch();

  const registerRouter = React.useCallback(
    (config: RouterItem[]): ReactNodeArray => {
      return config.map((route) => {
        if (Array.isArray(route.role) && !route.role.includes(role)) {
          return null;
        }
        if (route.components) {
          return registerRouter(route.components);
        }
        return <Route {...route} />;
      });
    },
    [role]
  );

  const clearUserInfo = () => {
    dispatch(
      updateUser({
        username: '',
        role: '',
      })
    );
    dispatch(
      updateToken({
        token: '',
      })
    );
  };

  const { loading, run: getUserInfo } = useRequest(
    user.getCurrentUserV1.bind(user),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const data = res.data.data;
          dispatch(
            updateUser({
              username: data?.user_name ?? '',
              role: data?.is_admin ? SystemRole.admin : '',
            })
          );
        } else {
          clearUserInfo();
        }
      },
      ready: !!token,
      refreshDeps: [token],
      onError: () => {
        clearUserInfo();
      },
    }
  );

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
            {!loading && !token && (
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
                  <EmptyBox if={!loading}>
                    <Switch>
                      {registerRouter(routerConfig)}
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
