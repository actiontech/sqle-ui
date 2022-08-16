import { LineConfig } from '@ant-design/plots';
import { DatePicker, Result } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker/generatePicker';
import { AxiosResponse } from 'axios';
import moment, { Moment } from 'moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import {
  IGetWorkflowCreatedCountEachDayV1Params,
  IGetWorkflowCreatedCountEachDayV1Return,
} from '../../../api/statistic/index.d';
import CommonLine from '../Charts/CommonLine';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

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
    start: 0,
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
  const [range, setRange] = useState<[Moment | null, Moment | null] | null>();

  const onSuccess = (
    res: AxiosResponse<IGetWorkflowCreatedCountEachDayV1Return>
  ) => {
    setData(res.data.data?.samples ?? []);
  };

  const param: IGetWorkflowCreatedCountEachDayV1Params = {
    filter_date_from:
      range?.[0]?.format(dateFormat) ??
      defaultRangeValue[0]!.format(dateFormat),
    filter_date_to:
      range?.[1]?.format(dateFormat) ??
      defaultRangeValue[1]!.format(dateFormat),
  };

  const { loading, errorMessage, refreshAction } =
    usePanelCommonRequest<IGetWorkflowCreatedCountEachDayV1Return>(
      () => statistic.getWorkflowCreatedCountEachDayV1(param),
      { onSuccess }
    );

  const disabledDate = (current: moment.Moment) => {
    return (
      current &&
      (current > moment().endOf('day') ||
        current <= moment().subtract(90, 'days'))
    );
  };

  const rangePickerChangeHandle: RangePickerProps<Moment>['onChange'] = (
    value
  ) => {
    setRange(value);
    refreshAction();
  };

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
          value={range}
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
