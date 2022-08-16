import { Result, Table } from 'antd';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWorkflowRejectedPercentGroupByInstance } from '../../../api/common';
import statistic from '../../../api/statistic';
import {
  IGetWorkflowRejectedPercentGroupByInstanceV1Params,
  IGetWorkflowRejectedPercentGroupByInstanceV1Return,
} from '../../../api/statistic/index.d';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const { tableLimit, tableColumns, tableCommonProps } = reportStatisticsData;
const param: IGetWorkflowRejectedPercentGroupByInstanceV1Params = {
  limit: tableLimit,
};
const DiffInstanceOrderRejectedPercent: React.FC = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<any[]>([]);

  const onSuccess = (
    res: AxiosResponse<IGetWorkflowRejectedPercentGroupByInstanceV1Return>
  ) => {
    setData(res.data.data ?? []);
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getWorkflowRejectedPercentGroupByInstanceV1(param),
    { onSuccess }
  );
  return (
    <PanelWrapper
      loading={loading}
      title={
        <span>
          {t('reportStatistics.diffInstanceOrderRejectRate.title', {
            tableLimit,
          })}
        </span>
      }
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
      <Table
        rowKey={'instance_name'}
        dataSource={data}
        columns={tableColumns.instance()}
        {...tableCommonProps<IWorkflowRejectedPercentGroupByInstance>()}
      />
    </PanelWrapper>
  );
};

export default DiffInstanceOrderRejectedPercent;
