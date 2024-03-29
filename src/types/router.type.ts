import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import { SystemRole } from '../data/common';
import { I18nKey } from './common.type';

export type GlobalRouterItemKeyLiteral =
  | 'dashboard'
  | 'rule'
  | 'ruleKnowledge'
  | 'sqlQuery'
  | 'reportStatistics'
  | 'account'
  | 'userCenter'
  | 'user'
  | 'role'
  | 'userGroup'
  | 'ruleManager'
  | 'globalRuleTemplate'
  | 'globalRuleTemplateCreate'
  | 'globalRuleTemplateImport'
  | 'globalRuleTemplateUpdate'
  | 'customRule'
  | 'createCustomRule'
  | 'updateCustomRule'
  | 'projectDetail'
  | 'projectList'
  | 'System'
  | 'syncDataSource'
  | 'syncDataSourceList'
  | 'syncDataSourceCreate'
  | 'syncDataSourceUpdate'
  | 'operationRecord'
  | 'redirect';

export type ProjectDetailRouterItemKeyLiteral =
  | 'order'
  | 'orderList'
  | 'orderCreate'
  | 'orderDetail'
  | 'orderAnalyze'
  | 'plane'
  | 'auditPlanDetail'
  | 'auditPlanDetailReport'
  | 'auditPlan'
  | 'auditPlanCreate'
  | 'auditPlanUpdate'
  | 'platformManage'
  | 'progress'
  | 'progressDetail'
  | 'progressUpdate'
  | 'Whitelist'
  | 'data'
  | 'dataCreate'
  | 'dataUpdate'
  | 'ruleTemplate'
  | 'ruleTemplateCreate'
  | 'ruleTemplateImport'
  | 'ruleTemplateUpdate'
  | 'member'
  | 'projectOverview'
  | 'projectRedirect'
  | 'SQLManagement'
  | 'SQLManagementAnalyze'
  | 'sqlAudit'
  | 'sqlAuditList'
  | 'sqlAuditDetail'
  | 'sqlAuditCreate';

export type RouterConfigItem<T extends string> = {
  role?: Array<SystemRole | ''>;
  label?: I18nKey;
  labelWithoutI18n?: string;
  key: T;
  icon?: ReactNode;
  children?: RouterConfigItem<T>[];
  hideChildrenInSliderMenu?: boolean;
  hideInSliderMenu?: boolean;
  hightLightMenuKey?: string;
  groups?: Array<{
    title: ReactNode;
    values: RouterConfigItem<T>[];
    key: string;
  }>;
} & RouteObject;
