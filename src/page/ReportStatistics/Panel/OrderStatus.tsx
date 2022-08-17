import { PieConfig } from '@ant-design/plots';
import { Result } from 'antd';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWorkflowStatusCountV1 } from '../../../api/common';
import statistic from '../../../api/statistic';
import { IGetWorkflowStatusCountV1Return } from '../../../api/statistic/index.d';
import i18n from '../../../locale';
import CommonPie from '../Charts/CommonPie';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const { secondLineSize } = reportStatisticsData;

const config: PieConfig = {
  data: [],
  angleField: 'value',
  colorField: 'status',
};

const orderStatusMap = () => {
  return new Map<keyof IWorkflowStatusCountV1, string>([
    ['closed_count', i18n.t('reportStatistics.orderStatus.closed')],
    ['executing_count', i18n.t('reportStatistics.orderStatus.executing')],
    [
      'execution_success_count',
      i18n.t('reportStatistics.orderStatus.executionSuccess'),
    ],
    ['rejected_count', i18n.t('reportStatistics.orderStatus.rejected')],
    [
      'waiting_for_audit_count',
      i18n.t('reportStatistics.orderStatus.waitingForAudit'),
    ],
    [
      'waiting_for_execution_count',
      i18n.t('reportStatistics.orderStatus.waitingForExecution'),
    ],
    [
      'executing_failed_count',
      i18n.t('reportStatistics.orderStatus.executionFailed'),
    ],
  ]);
};

const OrderStatus: React.FC = () => {
  const { t } = useTranslation();

  // todo..
  // 临时解决方案
  // 不填充默认值的情况下 jest render 组件时传递的 colorField 会覆盖掉原本的 colors 属性
  const [data, setData] = useState<PieConfig['data']>([
    { status: '', value: 0 },
  ]);
  const formatData = (
    originData?: IWorkflowStatusCountV1
  ): PieConfig['data'] => {
    if (!originData) {
      return [];
    }

    return Object.keys(originData).map((key) => {
      return {
        value: originData[key as keyof IWorkflowStatusCountV1],
        status: orderStatusMap().get(key as keyof IWorkflowStatusCountV1),
      };
    });
  };
  const onSuccess = (res: AxiosResponse<IGetWorkflowStatusCountV1Return>) => {
    setData(formatData(res.data.data));
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getWorkflowStatusCountV1(),
    { onSuccess }
  );

  return (
    <PanelWrapper
      title={t('reportStatistics.orderStatus.title')}
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
      <CommonPie
        {...{
          ...config,
          data,
        }}
        h={secondLineSize[1].h}
      />
    </PanelWrapper>
  );
};

export default OrderStatus;
