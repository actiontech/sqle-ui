import { ReactNode } from 'react';
import { RouteProps } from 'react-router-dom';
import { I18nKey } from './common.type';

export type RouterItem = {
  role?: string[];
  label: I18nKey;
  key: string;
  path?: string;
  icon?: ReactNode;
  components?: RouterItem[];
  hideInSliderMenu?: boolean;
} & RouteProps;
