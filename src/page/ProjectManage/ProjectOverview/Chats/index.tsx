import { GaugeConfig } from '@ant-design/plots';
import { PanelCommonProps } from '../Panel';

export interface CommonGaugeProps
  extends Omit<GaugeConfig, 'theme' | 'height' | 'locale'>,
    Omit<PanelCommonProps, 'projectName'> {
  h: number;
}
