import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import { routerConfig } from '../../../router/config';
import { Link, useLocation } from 'react-router-dom';
import { RouterItem } from '../../../types/router.type';
import { useTranslation } from 'react-i18next';
import { SystemRole } from '../../../data/common';
import useAuditPlanTypes from '../../../hooks/useAuditPlanTypes';
import { cloneDeep } from 'lodash';

const AuditPlan = React.lazy(
  () => import(/* webpackChunkName: "AuditPlan" */ '../../../page/AuditPlan')
);

const SiderMenu = () => {
  const userRole = useSelector<IReduxState, SystemRole | ''>(
    (state) => state.user.role
  );
  const { t } = useTranslation();
  const location = useLocation();

  const [innerRouterConfig, setInnerRouterConfig] = useState(routerConfig);

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
              title={route.labelWithoutI18n ?? t(route.label)}
            >
              {generateMenu(route.components)}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item key={route.key} icon={route.icon}>
            <Link to={route.path ?? ''}>{route.labelWithoutI18n ?? t(route.label)}</Link>
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
          if (pathname === '/auditPlan') {
            const params = new URLSearchParams(location.search);
            if (params.has('type')) {
              return [`auditPlan${params.get('type')}`];
            }
          }
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
    [location.search]
  );

  const selectMenuWrapper = React.useCallback((): string[] => {
    let pathname = location.pathname;
    let selectKey: string[] = [];
    while (pathname.length > 0) {
      selectKey = selectMenu(innerRouterConfig, pathname);
      if (selectKey.length !== 0) {
        return selectKey;
      } else {
        const temp = pathname.split('/');
        temp.pop();
        pathname = temp.join('/');
      }
    }
    return selectKey;
  }, [innerRouterConfig, location.pathname, selectMenu]);


  const { updateAuditPlanTypes, auditPlanTypes } = useAuditPlanTypes();
  
  useEffect(() => {
    updateAuditPlanTypes();
  }, [updateAuditPlanTypes]);

  useEffect(() => {
    if (auditPlanTypes.length > 0) {
      const newRouterConfig = cloneDeep(routerConfig);
      const plan = newRouterConfig.find(item => item.key === 'plane');
      if (!plan) {
        return;
      }
      const newRouters = auditPlanTypes.map<RouterItem>(e => ({
        path: `/auditPlan?type=${e.type}`,
        key: `auditPlan${e.type}`,
        label: 'menu',
        labelWithoutI18n: e.desc,
        component: AuditPlan,
      }));
      plan.components = [
        ...plan.components!,
        ...newRouters,
      ]

      setInnerRouterConfig(newRouterConfig)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditPlanTypes]);


  return (
    <Menu
      selectedKeys={selectMenuWrapper()}
      defaultOpenKeys={['platformManage', 'order', 'plane', 'userCenter']}
      mode="inline"
      theme="dark"
    >
      {generateMenu(innerRouterConfig)}
    </Menu>
  );
};

export default SiderMenu;
