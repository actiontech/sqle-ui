import { Typography } from 'antd';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import { IGetWorkflowDurationOfWaitingForExecutionV1Return } from '../../../api/statistic/index.d';
import { minuteToHourMinute } from '../../../utils/Math';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const OrderAverageExecuteTime: React.FC = () => {
  const { t } = useTranslation();

  const [time, setTime] = useState<string>('');

  const onSuccess = (
    res: AxiosResponse<IGetWorkflowDurationOfWaitingForExecutionV1Return>
  ) => {
    setTime(minuteToHourMinute(res.data.data?.minutes || 0));
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getWorkflowDurationOfWaitingForExecutionV1(),
    { onSuccess }
  );

  return (
    <PanelWrapper
      title={t('reportStatistics.orderAverageExecuteTime.title')}
      loading={loading}
      error={
        errorMessage ? (
          <Typography.Text type="danger">{errorMessage}</Typography.Text>
        ) : undefined
      }
    >
      <div className="statistics-value-style">
        <span>{time}</span>
      </div>
    </PanelWrapper>
  );
};

export default OrderAverageExecuteTime;
