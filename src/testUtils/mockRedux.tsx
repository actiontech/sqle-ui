import { Dictionary } from '../types/common.type';
import locale from '../store/locale';
import user from '../store/user';
import userManage from '../store/userManage';
import whitelist from '../store/whitelist';
import nav from '../store/nav';
import system from '../store/system';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import projectManage from '../store/projectManage';

const reducers = combineReducers({
  locale,
  user,
  userManage,
  whitelist,
  nav,
  system,
  projectManage,
});

export const storeFactory = (initStore: Dictionary = {}) => {
  return configureStore({
    reducer: reducers,
    preloadedState: initStore,
  });
};

export const mockUseLocation = () => {};

export const CustomProvider: React.FC<{
  initStore: Dictionary;
  children: JSX.Element;
}> = (props) => {
  return (
    <Provider store={storeFactory(props.initStore)}>{props.children}</Provider>
  );
};
