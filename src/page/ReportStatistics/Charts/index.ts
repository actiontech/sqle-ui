import { LineConfig, PieConfig, RadialBarConfig } from '@ant-design/plots';

export interface CommonLineProps
  extends Omit<LineConfig, 'theme' | 'height' | 'locale'> {
  h: number;
}

export interface CommonPieProps
  extends Omit<PieConfig, 'theme' | 'height' | 'locale'> {
  h: number;
}

export interface CommonRadialBarProps
  extends Omit<RadialBarConfig, 'theme' | 'height' | 'locale'> {
  h: number;
}

export const CommonChartsColors = [
  '#1890ff',
  '#ffa940',
  '#eb2f96',
  '#ff9c6e',
  '#fadb14',
  '#bae637',
  '#ffd666',
  '#52c41a',
  '#5cdbd3',
];
