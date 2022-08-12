import { LineConfig } from '@ant-design/plots';
import { useBoolean } from 'ahooks';
import { DatePicker, Result } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker';
import moment, { Moment } from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import { IGetTaskCreatedCountEachDayV1Params } from '../../../api/statistic/index.d';
import { ResponseCode } from '../../../data/common';
import CommonLine from '../Charts/CommonLine';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';

const { secondLineSize } = reportStatisticsData;
const dateFormat = 'YYYY-MM-DD';

const config: LineConfig = {
  data: [],
  xField: 'date',
  yField: 'value',
  xAxis: {
    tickCount: 7,
  },
  slider: {
    start: 0.5,
    end: 1,
  },
};

const OrderQuantityTrend: React.FC = () => {
  const defaultRangeValue: RangePickerProps<Moment>['defaultValue'] = [
    moment().subtract(30, 'days'),
    moment(),
  ];
  const { t } = useTranslation();
  const [data, setData] = useState<LineConfig['data']>([]);
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);
  const [errorMessage, setErrorMessage] = useState('');

  const disabledDate = (current: moment.Moment) => {
    return (
      current &&
      (current > moment().endOf('day') ||
        current <= moment().subtract(90, 'days'))
    );
  };

  const getOrderQuantityTrendValue = useCallback(
    (param: IGetTaskCreatedCountEachDayV1Params) => {
      startGetData();

      statistic
        .getTaskCreatedCountEachDayV1(param)
        .then((res) => {
          if (res.data.code !== ResponseCode.SUCCESS) {
            setErrorMessage(res.data.message ?? t('common.unknownError'));
          } else {
            setErrorMessage('');
            setData(res.data.data?.samples ?? []);
          }
        })
        .catch((error) => {
          setErrorMessage(error?.toString() ?? t('common.unknownError'));
        })
        .finally(() => {
          finishGetData();
        });
    },
    [finishGetData, startGetData, t]
  );

  const rangePickerChangeHandle: RangePickerProps<Moment>['onChange'] = (
    value
  ) => {
    const param: IGetTaskCreatedCountEachDayV1Params = {
      filter_date_from: value?.[0]?.format(dateFormat) ?? '',
      filter_date_to: value?.[1]?.format(dateFormat) ?? '',
    };
    getOrderQuantityTrendValue(param);
  };

  useEffect(() => {
    const param: IGetTaskCreatedCountEachDayV1Params = {
      filter_date_from: defaultRangeValue?.[0]?.format(dateFormat) ?? '',
      filter_date_to: defaultRangeValue?.[1]?.format(dateFormat) ?? '',
    };
    getOrderQuantityTrendValue(param);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOrderQuantityTrendValue]);

  return (
    <PanelWrapper
      title={t('reportStatistics.orderQuantityTrend.title')}
      subTitle={
        <DatePicker.RangePicker
          size="small"
          disabledDate={disabledDate}
          onChange={rangePickerChangeHandle}
          defaultValue={defaultRangeValue}
          allowClear={false}
          data-testid="filterRangePicker"
        />
      }
      loading={loading}
      error={
        errorMessage ? (
          <Result
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={errorMessage}
          />
        ) : null
      }
    >
      <CommonLine {...{ ...config, data }} h={secondLineSize[0].h} />
    </PanelWrapper>
  );
};

export default OrderQuantityTrend;
