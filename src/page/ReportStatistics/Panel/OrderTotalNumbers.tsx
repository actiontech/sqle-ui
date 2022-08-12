import { useBoolean } from 'ahooks';
import { Space, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import { ResponseCode } from '../../../data/common';
import PanelWrapper from './PanelWrapper';

const OrderTotalNumbers: React.FC = () => {
  const { t } = useTranslation();
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [newOrder, setNewOrder] = useState<number>(0);

  useEffect(() => {
    const getData = () => {
      startGetData();
      statistic
        .getTaskCountV1()
        .then((res) => {
          if (res.data.code !== ResponseCode.SUCCESS) {
            setErrorMessage(res.data.message ?? t('common.unknownError'));
          } else {
            setErrorMessage('');
            setTotalOrder(res.data.data?.total ?? 0);
            setNewOrder(res.data.data?.today_count ?? 0);
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
  }, [finishGetData, startGetData, t]);

  return (
    <PanelWrapper
      title={t('reportStatistics.orderTotalNumbers.title')}
      loading={loading}
      error={
        errorMessage ? (
          <Typography.Text type="danger">{errorMessage}</Typography.Text>
        ) : undefined
      }
    >
      <Space className="statistics-value-style">
        <Statistic value={totalOrder} />
        <span>/</span>
        <Statistic value={newOrder} />
      </Space>
    </PanelWrapper>
  );
};

export default OrderTotalNumbers;
