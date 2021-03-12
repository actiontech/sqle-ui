import React from 'react';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import { routerConfig } from '../../../router/config';
import { Link, useLocation } from 'react-router-dom';
import { RouterItem } from '../../../types/router.type';
import { useTranslation } from 'react-i18next';

const SiderMenu = () => {
  const userRole = useSelector<IReduxState, string>((state) => state.user.role);
  const { t } = useTranslation();
  const location = useLocation();

  const generateMenu = React.useCallback(
    (config: RouterItem[]) => {
      return config.map((route) => {
        if (Array.isArray(route.role) && !route.role?.includes(userRole)) {
          return null;
        }
        if (!!route.components) {
          return (
            <Menu.SubMenu
              key={route.key}
              icon={route.icon}
              title={t(route.label)}
            >
              {generateMenu(route.components)}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item key={route.key} icon={route.icon}>
            <Link to={route.path ?? ''}>{t(route.label)}</Link>
          </Menu.Item>
        );
      });
    },
    [t, userRole]
  );

  const selectMenu = React.useCallback(
    (config: RouterItem[]): string[] => {
      for (const route of config) {
        if (route.path === location.pathname) {
          return [route.key];
        }
        if (!!route.components) {
          const key = selectMenu(route.components);
          if (!!key) {
            return key;
          }
        }
      }
      return [];
    },
    [location.pathname]
  );

  return (
    <Menu
      selectedKeys={selectMenu(routerConfig)}
      defaultOpenKeys={['platformManage']}
      mode="inline"
      theme="dark"
    >
      {generateMenu(routerConfig)}
    </Menu>
  );
};

export default SiderMenu;
