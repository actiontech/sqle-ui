import { Space, Statistic, Typography } from 'antd';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import { IGetTaskCountV1Return } from '../../../api/statistic/index.d';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const OrderTotalNumbers: React.FC = () => {
  const { t } = useTranslation();
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [newOrder, setNewOrder] = useState<number>(0);

  const formatResult = (res: AxiosResponse<IGetTaskCountV1Return>) => {
    setTotalOrder(res.data.data?.total ?? 0);
    setNewOrder(res.data.data?.today_count ?? 0);
  };

  const { loading, errorMessage } =
    usePanelCommonRequest<IGetTaskCountV1Return>(
      () => statistic.getTaskCountV1(),
      formatResult
    );

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
