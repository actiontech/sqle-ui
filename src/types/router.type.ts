import { ReactNode } from 'react';
import { RouteProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export type RouterItem = {
  role?: string[];
  label: Parameters<ReturnType<typeof useTranslation>['t']>[0];
  key: string;
  path?: string;
  icon?: ReactNode;
  components?: RouterItem[];
  hideInSliderMenu?: boolean;
} & RouteProps;
