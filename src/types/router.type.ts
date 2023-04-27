import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import { SystemRole } from '../data/common';
import { I18nKey } from './common.type';

export type GlobalRouterItemKeyLiteral =
  | 'dashboard'
  | 'rule'
  | 'sqlQuery'
  | 'reportStatistics'
  | 'account'
  | 'userCenter'
  | 'user'
  | 'role'
  | 'userGroup'
  | 'globalRuleTemplate'
  | 'globalRuleTemplateCreate'
  | 'globalRuleTemplateImport'
  | 'globalRuleTemplateUpdate'
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
  | 'projectRedirect';

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
  groups?: Array<{ title: string; values: RouterConfigItem<T>[] }>;
} & RouteObject;
