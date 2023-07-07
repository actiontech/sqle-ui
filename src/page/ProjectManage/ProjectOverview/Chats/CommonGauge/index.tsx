import { Gauge, GaugeConfig } from '@ant-design/plots';
import { CommonGaugeProps } from '..';
import { projectOverviewData } from '../../index.data';
import { useMemo } from 'react';
import {
  defaultAxis,
  defaultIndicator,
  defaultRange,
  defaultStatistic,
  getColorByRangeAndPercent,
  statisticContentFormatter,
} from './index.data';
import { registerCustomShape } from './registerShape';

const { rowHeight } = projectOverviewData;

registerCustomShape();

const CommonGauge: React.FC<CommonGaugeProps> = ({
  commonPadding,
  currentTheme,
  language,
  ...props
}) => {
  const { h, padding = 'auto' } = props;

  const height = useMemo(() => {
    return rowHeight * h + commonPadding * (h - 1) - 80;
  }, [h, commonPadding]);

  const customIndicator = useMemo<GaugeConfig['indicator']>(() => {
    if (props.indicator) {
      return props.indicator;
    }

    return {
      ...defaultIndicator,
      pointer: {
        style: {
          fill: getColorByRangeAndPercent(
            props.percent,
            props.range ?? defaultRange
          ),
        },
      },
    };
  }, [props.indicator, props.percent, props.range]);

  const customStatistic = useMemo<GaugeConfig['statistic']>(() => {
    if (props.statistic) {
      return props.statistic;
    }

    return {
      ...defaultStatistic,
      content: {
        style: {
          fontSize: '16px',
          lineHeight: '16px',
          color: getColorByRangeAndPercent(
            props.percent,
            props.range ?? defaultRange
          ),
        },
        formatter: statisticContentFormatter,
      },
    };
  }, [props.percent, props.range, props.statistic]);
  return (
    <Gauge
      range={defaultRange}
      type="meter"
      axis={defaultAxis}
      {...props}
      indicator={customIndicator}
      statistic={customStatistic}
      height={height}
      padding={padding}
      theme={currentTheme}
      locale={language}
    />
  );
};

export default CommonGauge;
