import React from 'react';
import { RouteProps } from 'react-router-dom';
import Nav from '../components/Nav';

const Home = React.lazy(
  () => import('../page/Home' /* webpackChunkName: "Home" */)
);

const Login = React.lazy(
  () => import('../page/Login' /* webpackChunkName: "Login" */)
);

export const unAuthRouter: RouteProps[] = [
  {
    path: '/login',
    component: Login,
    exact: true,
  },
];

export const routerConfig: RouteProps[] = [
  {
    path: '/',
    component: Nav,
    children: [
      {
        path: '/',
        exact: true,
        component: Home,
      },
    ],
  },
];
