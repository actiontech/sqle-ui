import { render } from '@testing-library/react';
import CommonGauge from '../CommonGauge';
import {
  defaultRange,
  getColorByRangeAndPercent,
  statisticContentFormatter,
} from '../CommonGauge/index.data';
import { PanelCommonProps } from '../../Panel';

const commonProps: Omit<PanelCommonProps, 'projectName'> = {
  commonPadding: 24,
  currentTheme: 'light',
  language: 'zh-CN',
};

describe('test CommonGauge', () => {
  test('should match snapshot', () => {
    const { container, rerender } = render(
      <CommonGauge h={1} percent={0.2} {...commonProps} />
    );
    expect(container).toMatchSnapshot();

    rerender(<CommonGauge h={1} percent={0.4} {...commonProps} />);
    expect(container).toMatchSnapshot();

    rerender(<CommonGauge h={1} percent={0.7} {...commonProps} />);
    expect(container).toMatchSnapshot();

    rerender(<CommonGauge h={1} percent={0.9} {...commonProps} />);
    expect(container).toMatchSnapshot();

    rerender(
      <CommonGauge
        {...commonProps}
        h={1}
        percent={0.9}
        statistic={{
          title: {
            style: ({ percent }) => {
              return {
                fontSize: '36px',
                lineHeight: 1,
              };
            },
          },
          content: {
            offsetY: 36,
            style: {
              fontSize: '24px',
              color: '#4B535E',
            },
            formatter: () => 'test',
          },
        }}
        indicator={{
          pointer: {
            style: {
              stroke: '#D0D0D0',
            },
          },
          pin: {
            style: {
              stroke: '#D0D0D0',
            },
          },
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('getColorByRangeAndPercent and statisticContentFormatter', () => {
    expect(getColorByRangeAndPercent(0, defaultRange)).toBe(
      defaultRange!.color![0]
    );
    expect(getColorByRangeAndPercent(0.1, defaultRange)).toBe(
      defaultRange!.color![0]
    );
    expect(getColorByRangeAndPercent(0.25, defaultRange)).toBe(
      defaultRange!.color![1]
    );
    expect(getColorByRangeAndPercent(0.3, defaultRange)).toBe(
      defaultRange!.color![1]
    );
    expect(getColorByRangeAndPercent(0.5, defaultRange)).toBe(
      defaultRange!.color![2]
    );
    expect(getColorByRangeAndPercent(0.6, defaultRange)).toBe(
      defaultRange!.color![2]
    );
    expect(getColorByRangeAndPercent(0.75, defaultRange)).toBe(
      defaultRange!.color![3]
    );
    expect(getColorByRangeAndPercent(0.9, defaultRange)).toBe(
      defaultRange!.color![3]
    );
    expect(getColorByRangeAndPercent(1, defaultRange)).toBe(
      defaultRange!.color![3]
    );

    expect(statisticContentFormatter(undefined)).toBe('unknown');
    expect(statisticContentFormatter({ key: '1' })).toBe('unknown');
    expect(statisticContentFormatter({ percent: '1' })).toBe('100');
    expect(statisticContentFormatter({ percent: '0' })).toBe('0');
    expect(statisticContentFormatter({ percent: '0.3333333' })).toBe('33');
    expect(statisticContentFormatter({ percent: 0.49 })).toBe('49');
    expect(statisticContentFormatter({ percent: 0.3263425234 })).toBe('33');
  });
});
