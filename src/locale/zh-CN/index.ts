import account from './account';
import audit from './audit';
import common from './common';
import dataSource from './dataSource';
import login from './login';
import menu from './menu';
import rule from './rule';
import ruleTemplate from './ruleTemplate';
import user from './user';
import workflow from './workflow';

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
    workflow,
    audit,
  },
};
