/*
 * custom config
 */

import { GaugeConfig } from '@ant-design/plots';
import { CUSTOM_SHAPE } from './registerShape';
import { floatToPercent } from '../../../../../utils/Math';

export const defaultRange: GaugeConfig['range'] = {
  ticks: [0, 1 / 4, 1 / 2, 3 / 4, 1],
  color: ['#F4664A', '#FAAD14', '#59d9f9', '#30BF78'],
};

export const getColorByRangeAndPercent = (
  percent: number,
  range: GaugeConfig['range'],
  defaultColor = '#59d9f9'
) => {
  const ticks = range?.ticks ?? [];
  const colors = range?.color ?? [];
  let rang = 0;
  if (percent === ticks[ticks.length - 1]) {
    return colors[colors.length - 1];
  }
  for (let i = 0; i < ticks.length; ++i) {
    if (percent >= ticks[i] && percent < ticks[i + 1]) {
      rang = i;
    }
  }

  return colors[rang] || defaultColor;
};

export const defaultIndicator: GaugeConfig['indicator'] = {
  shape: CUSTOM_SHAPE,
  pointer: {
    style: {
      fill: '#59d9f9',
    },
  },
};

export const statisticContentFormatter = (value?: Record<string, any>) => {
  if (value && !isNaN(parseInt(value.percent))) {
    return floatToPercent(value.percent, 0).toString();
  }
  return 'unknown';
};
export const defaultStatistic: GaugeConfig['statistic'] = {
  content: {
    style: {
      fontSize: '16px',
      lineHeight: '16px',
      color: '#00a6f0',
    },
    formatter: statisticContentFormatter,
  },
};
export const defaultAxis: GaugeConfig['axis'] = {
  label: null,
};
