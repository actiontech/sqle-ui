import { ReactNode } from 'react';
import { RouteProps } from 'react-router-dom';
import { SystemRole } from '../data/common';
import { I18nKey } from './common.type';

export type RouterItem = {
  role?: Array<SystemRole | ''>;
  label: I18nKey;
  labelWithoutI18n?: string;
  key: string;
  path?: string;
  icon?: ReactNode;
  components?: RouterItem[];
  hideInSliderMenu?: boolean;
  hightLightMenuKey?: string;
} & RouteProps;
