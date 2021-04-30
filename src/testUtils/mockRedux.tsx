import { Dictionary } from '../types/common.type';
import * as redux from 'react-redux';
import locale from '../store/locale';
import user from '../store/user';
import userManage from '../store/userManage';
import whitelist from '../store/whitelist';
import { combineReducers, createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';

const reducers = combineReducers({
  locale,
  user,
  userManage,
  whitelist,
});

export const storeFactory = (initStore: Dictionary = {}) => {
  return createStore(reducers, initStore);
};

export const mockUseSelector = (store?: Dictionary) => {
  const spy = jest.spyOn(redux, 'useSelector');
  spy.mockImplementation((getFn: Function) => {
    return getFn(store);
  });
  return spy;
};

export const mockUseDispatch = () => {
  const spy = jest.spyOn(redux, 'useDispatch');
  spy.mockReturnValue((): any => void 0);
  return spy;
};

export const CustomProvider: React.FC<{ initStore: Dictionary }> = (props) => {
  return (
    <Provider store={storeFactory(props.initStore)}>{props.children}</Provider>
  );
};
