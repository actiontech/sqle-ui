import React from 'react';
import { RouteProps } from 'react-router-dom';
import { RouterItem } from '../types/router.type';
import {
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  UserOutlined,
  DatabaseOutlined,
  AuditOutlined,
  NodeIndexOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const Home = React.lazy(
  () => import(/* webpackChunkName: "Home" */ '../page/Home')
);

const Login = React.lazy(
  () => import(/* webpackChunkName: "Login" */ '../page/Login')
);

const User = React.lazy(
  () => import(/* webpackChunkName: "User" */ '../page/User')
);

export const unAuthRouter: RouteProps[] = [
  {
    path: '/login',
    component: Login,
    exact: true,
  },
];

export const routerConfig: RouterItem[] = [
  {
    path: '/',
    exact: true,
    label: 'menu.dashboard',
    component: Home,
    icon: <PieChartOutlined />,
    key: 'dashboard',
  },
  {
    path: '/rule',
    exact: true,
    label: 'menu.rule',
    component: Home,
    icon: <DesktopOutlined />,
    key: 'rule',
  },
  {
    label: 'menu.platformManage',
    role: ['admin'],
    key: 'platformManage',
    icon: <ContainerOutlined />,
    components: [
      {
        path: '/user',
        exact: true,
        label: 'menu.user',
        component: User,
        icon: <UserOutlined />,
        key: 'user',
      },
      {
        path: '/data',
        exact: true,
        key: 'data',
        label: 'menu.dataSource',
        icon: <DatabaseOutlined />,
        component: () => <div>data source</div>,
      },
      {
        path: '/rule/template',
        key: 'ruleTemplate',
        exact: true,
        label: 'menu.ruleTemplate',
        icon: <AuditOutlined />,
        component: () => <div>rule template</div>,
      },
      {
        path: '/progress',
        exact: true,
        key: 'progress',
        label: 'menu.progressManage',
        icon: <NodeIndexOutlined />,
        component: () => <div>progress manage</div>,
      },
      {
        path: '/system',
        exact: true,
        key: 'system',
        label: 'menu.systemSetting',
        icon: <SettingOutlined />,
        component: () => <div>system setting</div>,
      },
    ],
  },
];
