import { PieConfig } from '@ant-design/plots';
import { useBoolean } from 'ahooks';
import { Result } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ITaskStatusCountV1 } from '../../../api/common';
import statistic from '../../../api/statistic';
import { ResponseCode } from '../../../data/common';
import i18n from '../../../locale';
import { IReduxState } from '../../../store';
import CommonPie from '../Charts/CommonPie';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';

const { secondLineSize } = reportStatisticsData;

const config: PieConfig = {
  data: [],
  angleField: 'value',
  colorField: 'status',
};

const orderStatusMap = () => {
  return new Map<keyof ITaskStatusCountV1, string>([
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
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);
  const [errorMessage, setErrorMessage] = useState('');
  const refreshFlag = useSelector((state: IReduxState) => {
    return state.reportStatistics.refreshFlag;
  });

  useEffect(() => {
    const formatData = (originData?: ITaskStatusCountV1): PieConfig['data'] => {
      if (!originData) {
        return [];
      }

      return Object.keys(originData).map((key) => {
        return {
          value: originData[key as keyof ITaskStatusCountV1],
          status: orderStatusMap().get(key as keyof ITaskStatusCountV1),
        };
      });
    };
    const getData = () => {
      startGetData();
      statistic
        .getTaskStatusCountV1()
        .then((res) => {
          if (res.data.code !== ResponseCode.SUCCESS) {
            setErrorMessage(res.data.message ?? t('common.unknownError'));
          } else {
            setErrorMessage('');
            setData(formatData(res.data.data));
          }
        })
        .catch((error) => {
          setErrorMessage(error?.toString() ?? t('common.unknownError'));
        })
        .finally(() => {
          finishGetData();
        });
    };

    getData();
  }, [finishGetData, startGetData, t, refreshFlag]);

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
