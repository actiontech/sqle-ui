import { useBoolean } from 'ahooks';
import { Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import statistic from '../../../api/statistic';
import { ResponseCode } from '../../../data/common';
import { IReduxState } from '../../../store';
import { floatRound } from '../../../utils/Math';
import PanelWrapper from './PanelWrapper';

const OrderPassPercent: React.FC = () => {
  const { t } = useTranslation();
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [auditPass, setAuditPass] = useState<string>('');
  const [executeSuccess, setExecuteSuccess] = useState<string>('');
  const refreshFlag = useSelector((state: IReduxState) => {
    return state.reportStatistics.refreshFlag;
  });
  useEffect(() => {
    const getData = () => {
      startGetData();
      statistic
        .getTaskPassPercentV1()
        .then((res) => {
          if (res.data.code !== ResponseCode.SUCCESS) {
            setErrorMessage(res.data.message ?? t('common.unknownError'));
          } else {
            setErrorMessage('');
            setAuditPass(
              `${floatRound(res.data.data?.audit_pass_percent ?? 0)}%`
            );
            setExecuteSuccess(
              `${floatRound(res.data.data?.execution_success_percent ?? 0)}%`
            );
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
        <span>/</span>
        <span>{executeSuccess}</span>
      </Space>
    </PanelWrapper>
  );
};

export default OrderPassPercent;
