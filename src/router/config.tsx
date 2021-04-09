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
  ConsoleSqlOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import { SystemRole } from '../data/common';

const Home = React.lazy(
  () => import(/* webpackChunkName: "Home" */ '../page/Home')
);

const Login = React.lazy(
  () => import(/* webpackChunkName: "Login" */ '../page/Login')
);

const User = React.lazy(
  () => import(/* webpackChunkName: "User" */ '../page/User')
);

const Rule = React.lazy(
  () => import(/* webpackChunkName: "Rule" */ '../page/Rule')
);

const DataSource = React.lazy(
  () => import(/* webpackChunkName: "DataSource" */ '../page/DataSource')
);

const RuleTemplate = React.lazy(
  () => import(/* webpackChunkName: "RuleTemplate" */ '../page/RuleTemplate')
);

const Account = React.lazy(
  () => import(/* webpackChunkName: "Account" */ '../page/Account')
);

const CreateOrder = React.lazy(
  () => import(/* webpackChunkName: "CreateOrder" */ '../page/Order/Create')
);

const OrderDetail = React.lazy(
  () => import(/* webpackChunkName: "OrderDetail" */ '../page/Order/Detail')
);

const OrderList = React.lazy(
  () => import(/* webpackChunkName: "Order" */ '../page/Order/List')
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
    component: Rule,
    icon: <DesktopOutlined />,
    key: 'rule',
  },
  {
    path: '/account',
    exact: true,
    label: 'common.account',
    component: Account,
    hideInSliderMenu: true,
    key: 'account',
  },
  {
    label: 'menu.order',
    key: 'order',
    icon: <ConsoleSqlOutlined />,
    components: [
      {
        path: '/order',
        exact: true,
        label: 'menu.orderList',
        icon: <BarsOutlined />,
        component: OrderList,
        key: 'orderList',
      },
      {
        path: '/order/create',
        exact: true,
        label: 'menu.workflow',
        component: CreateOrder,
        icon: <DesktopOutlined />,
        key: 'orderList',
        hideInSliderMenu: true,
      },
      {
        path: '/order/:orderId',
        exact: true,
        label: 'menu.orderDetail',
        hideInSliderMenu: true,
        component: OrderDetail,
        key: 'orderDetail',
      },
    ],
  },
  {
    label: 'menu.platformManage',
    role: [SystemRole.admin],
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
        key: 'data',
        label: 'menu.dataSource',
        icon: <DatabaseOutlined />,
        component: DataSource,
      },
      {
        path: '/rule/template',
        key: 'ruleTemplate',
        label: 'menu.ruleTemplate',
        icon: <AuditOutlined />,
        component: RuleTemplate,
      },
      // {
      //   path: '/progress',
      //   exact: true,
      //   key: 'progress',
      //   label: 'menu.progressManage',
      //   icon: <NodeIndexOutlined />,
      //   component: () => <div>progress manage</div>,
      // },
      // {
      //   path: '/system',
      //   exact: true,
      //   key: 'system',
      //   label: 'menu.systemSetting',
      //   icon: <SettingOutlined />,
      //   component: () => <div>system setting</div>,
      // },
    ],
  },
];
