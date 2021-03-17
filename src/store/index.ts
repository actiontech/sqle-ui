import { configureStore } from '@reduxjs/toolkit';
import locale from './locale';
import user from './user';
import userManage from './userManage';

const store = configureStore({
  reducer: {
    locale,
    user,
    userManage,
  },
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
