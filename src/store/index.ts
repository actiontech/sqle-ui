import { configureStore } from '@reduxjs/toolkit';
import locale from './locale';
import user from './user';
import userManage from './userManage';
import whitelist from './whitelist';

const store = configureStore({
  reducer: {
    locale,
    user,
    userManage,
    whitelist,
  },
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
