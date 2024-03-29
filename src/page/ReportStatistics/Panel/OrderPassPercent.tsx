import { Space, Typography } from 'antd';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import { IGetWorkflowAuditPassPercentV1Return } from '../../../api/statistic/index.d';
import { floatRound } from '../../../utils/Math';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const OrderPassPercent: React.FC = () => {
  const { t } = useTranslation();
  const [auditPass, setAuditPass] = useState<string>('');

  const onSuccess = (
    res: AxiosResponse<IGetWorkflowAuditPassPercentV1Return>
  ) => {
    setAuditPass(`${floatRound(res.data.data?.audit_pass_percent ?? 0)}%`);
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getWorkflowAuditPassPercentV1(),
    { onSuccess }
  );

  return (
    <PanelWrapper
      title={t('reportStatistics.orderPassRate.title')}
      loading={loading}
      error={
        errorMessage ? (
          <Typography.Text type="danger">{errorMessage}</Typography.Text>
        ) : undefined
      }
    >
      <Space className="statistics-value-style">
        <span>{auditPass}</span>
      </Space>
    </PanelWrapper>
  );
};

export default OrderPassPercent;
