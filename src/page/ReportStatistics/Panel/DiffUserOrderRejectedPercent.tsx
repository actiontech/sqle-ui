import { Result, Table } from 'antd';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWorkflowRejectedPercentGroupByCreator } from '../../../api/common';
import statistic from '../../../api/statistic';
import {
  IGetWorkflowRejectedPercentGroupByCreatorV1Params,
  IGetWorkflowRejectedPercentGroupByCreatorV1Return,
} from '../../../api/statistic/index.d';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const { tableLimit, tableColumns, tableCommonProps } = reportStatisticsData;
const param: IGetWorkflowRejectedPercentGroupByCreatorV1Params = {
  limit: tableLimit,
};
const DiffUserOrderRejectedPercent: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);

  const onSuccess = (
    res: AxiosResponse<IGetWorkflowRejectedPercentGroupByCreatorV1Return>
  ) => {
    setData(res.data.data ?? []);
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getWorkflowRejectedPercentGroupByCreatorV1(param),
    { onSuccess }
  );

  return (
    <PanelWrapper
      loading={loading}
      title={
        <span>
          {t('reportStatistics.diffUserOrderRejectRate.title', {
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
        rowKey={'creator'}
        dataSource={data}
        columns={tableColumns.user()}
        {...tableCommonProps<IWorkflowRejectedPercentGroupByCreator>()}
      />
    </PanelWrapper>
  );
};

export default DiffUserOrderRejectedPercent;
