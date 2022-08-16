import { PieConfig } from '@ant-design/plots';
import { Result } from 'antd';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import { IGetInstancesTypePercentV1Return } from '../../../api/statistic/index.d';
import CommonPie from '../Charts/CommonPie';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const config: PieConfig = {
  data: [],
  angleField: 'count',
  colorField: 'type',
  innerRadius: 0.6,
  label: {
    type: 'inner',
    offset: '-50%',
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 14,
    },
  },
  legend: {
    offsetX: -30,
  },
};
const { thirdLineSize } = reportStatisticsData;

const InstanceProportionWithDbType: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<PieConfig['data']>([
    {
      count: 0,
      type: '',
    },
  ]);

  const onSuccess = (res: AxiosResponse<IGetInstancesTypePercentV1Return>) => {
    setData(res.data.data?.instance_type_percents ?? []);
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getInstancesTypePercentV1(),
    { onSuccess }
  );

  return (
    <PanelWrapper
      title={t('reportStatistics.orderInstanceTypeScale.title')}
      loading={loading}
      error={
        errorMessage ? (
          <Result
            style={{ padding: 10 }}
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={errorMessage}
          />
        ) : null
      }
    >
      <CommonPie {...{ ...config, data }} h={thirdLineSize.h} />
    </PanelWrapper>
  );
};

export default InstanceProportionWithDbType;
