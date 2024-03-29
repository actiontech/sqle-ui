import account from './account';
import audit from './audit';
import common from './common';
import dashboard from './dashboard';
import dataSource from './dataSource';
import login from './login';
import menu from './menu';
import order from './order';
import rule from './rule';
import ruleTemplate from './ruleTemplate';
import user from './user';
import whitelist from './whitelist';
import system from './system';
import reportStatistics from './reportStatistics';
import projectManage from './projectManage';
import syncDataSource from './syncDataSource'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  translation: {
    login,
    common,
    menu,
    user,
    dataSource,
    ruleTemplate,
    account,
    rule,
    audit,
    order,
    dashboard,
    whitelist,
    system,
    reportStatistics,
    projectManage,
    syncDataSource
  },
};
