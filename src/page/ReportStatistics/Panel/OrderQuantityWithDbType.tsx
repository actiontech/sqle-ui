import { InfoCircleOutlined } from '@ant-design/icons';
import { PieConfig } from '@ant-design/plots';
import { Result, Space, Tooltip } from 'antd';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import { IGetWorkflowPercentCountedByInstanceTypeV1Return } from '../../../api/statistic/index.d';
import CommonPie from '../Charts/CommonPie';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const config: PieConfig = {
  data: [],
  angleField: 'count',
  colorField: 'instance_type',
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

const OrderQuantityWithDbType: React.FC = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<PieConfig['data']>([
    { count: 0, instance_type: '' },
  ]);

  const onSuccess = (
    res: AxiosResponse<IGetWorkflowPercentCountedByInstanceTypeV1Return>
  ) => {
    setData(res.data.data?.workflow_percents ?? []);
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getWorkflowPercentCountedByInstanceTypeV1(),
    { onSuccess }
  );

  return (
    <PanelWrapper
      title={
        <Space>
          {t('reportStatistics.orderDbTypeScale.title')}
          <Tooltip overlay={t('reportStatistics.orderDbTypeScale.tips')}>
            <InfoCircleOutlined
              data-testid="order-db-type-scale-tips"
              className="text-orange"
            />
          </Tooltip>
        </Space>
      }
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

export default OrderQuantityWithDbType;
