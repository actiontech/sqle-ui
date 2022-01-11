import { configureStore } from '@reduxjs/toolkit';
import locale from './locale';
import user from './user';
import userManage from './userManage';
import whitelist from './whitelist';
import ruleTemplate from './ruleTemplate';
import nav from './nav';

const store = configureStore({
  reducer: {
    locale,
    user,
    userManage,
    whitelist,
    ruleTemplate,
    nav,
  },
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
