import React from 'react';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import { routerConfig } from '../../../router/config';
import { Link, useLocation } from 'react-router-dom';
import { RouterItem } from '../../../types/router.type';
import { useTranslation } from 'react-i18next';
import { SystemRole } from '../../../data/common';

const SiderMenu = () => {
  const userRole = useSelector<IReduxState, SystemRole | ''>(
    (state) => state.user.role
  );
  const { t } = useTranslation();
  const location = useLocation();

  const generateMenu = React.useCallback(
    (config: RouterItem[]) => {
      return config.map((route) => {
        if (Array.isArray(route.role) && !route.role?.includes(userRole)) {
          return null;
        }
        if (route.hideInSliderMenu) {
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
    (config: RouterItem[], pathname: string): string[] => {
      for (const route of config) {
        if (route.path === pathname && route.hideInSliderMenu !== true) {
          return [route.key];
        }
        if (!!route.components) {
          const key = selectMenu(route.components, pathname);
          if (key.length > 0) {
            return key;
          }
        }
      }
      return [];
    },
    []
  );

  const selectMenuWrapper = React.useCallback((): string[] => {
    let pathname = location.pathname;
    let selectKey: string[] = [];
    while (pathname.length > 0) {
      selectKey = selectMenu(routerConfig, pathname);
      if (selectKey.length !== 0) {
        return selectKey;
      } else {
        const temp = pathname.split('/');
        temp.pop();
        pathname = temp.join('/');
      }
    }
    return selectKey;
  }, [location.pathname, selectMenu]);

  return (
    <Menu
      selectedKeys={selectMenuWrapper()}
      defaultOpenKeys={['platformManage', 'order']}
      mode="inline"
      theme="dark"
    >
      {generateMenu(routerConfig)}
    </Menu>
  );
};

export default SiderMenu;
