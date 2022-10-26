import { Dictionary } from '../types/common.type';
import * as redux from 'react-redux';
import locale from '../store/locale';
import user from '../store/user';
import userManage from '../store/userManage';
import whitelist from '../store/whitelist';
import nav from '../store/nav';
import { combineReducers, createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';

const reducers = combineReducers({
  locale,
  user,
  userManage,
  whitelist,
  nav,
});

export const storeFactory = (initStore: Dictionary = {}) => {
  return createStore(reducers, initStore);
};

export const mockUseSelector = (store?: any) => {
  const spy = jest.spyOn(redux, 'useSelector');
  spy.mockImplementation((getFn: Function) => {
    return getFn(store);
  });
  return spy;
};

export const mockUseDispatch = () => {
  const scopeDispatch = jest.fn();
  const spy = jest.spyOn(redux, 'useDispatch');
  spy.mockImplementation(() => scopeDispatch);
  return { spy, scopeDispatch };
};

export const mockUseLocation = () => {}


export const CustomProvider: React.FC<{ initStore: Dictionary }> = (props) => {
  return (
    <Provider store={storeFactory(props.initStore)}>{props.children}</Provider>
  );
};
