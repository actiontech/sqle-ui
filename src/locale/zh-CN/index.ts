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
import system from './system';
import user from './user';
import role from './role';
import whitelist from './whitelist';
import workflowTemplate from './workflowTemplate';
import auditPlan from './auditPlan';
import userGroup from './userGroup';
import sqlQuery from './sqlQuery';
import sqlAnalyze from './sqlAnalyze';

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
    workflowTemplate,
    auditPlan,
    role,
    userGroup,
    sqlQuery,
    sqlAnalyze,
  },
};
