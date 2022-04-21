import { configureStore } from '@reduxjs/toolkit';
import locale from './locale';
import user from './user';
import userManage from './userManage';
import whitelist from './whitelist';
import ruleTemplate from './ruleTemplate';
import nav from './nav';
import system from './system';
import auditPlan from './auditPlan';

const store = configureStore({
  reducer: {
    locale,
    user,
    userManage,
    whitelist,
    ruleTemplate,
    nav,
    system,
    auditPlan,
  },
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
