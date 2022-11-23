import { ReactNode } from 'react';
import { RouteProps } from 'react-router-dom';
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
  | 'projectDetail'
  | 'projectList'
  | 'System';

export type ProjectDetailRouterItemKeyLiteral =
  | 'order'
  | 'orderList'
  | 'orderCreate'
  | 'orderDetail'
  | 'orderAnalyze'
  | 'plane'
  | 'auditPlanDetail'
  | 'auditPlan'
  | 'platformManage'
  | 'progress'
  | 'Whitelist'
  | 'data'
  | 'ruleTemplate'
  | 'member'
  | 'projectOverview';

export type RouterItem<T extends string> = {
  role?: Array<SystemRole | ''>;
  label: I18nKey;
  labelWithoutI18n?: string;
  key: T;
  path?: string;
  icon?: ReactNode;
  components?: RouterItem<T>[];
  hideInSliderMenu?: boolean;
  hightLightMenuKey?: string;
} & RouteProps;
