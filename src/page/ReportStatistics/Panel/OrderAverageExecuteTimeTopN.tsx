import { Result, Table } from 'antd';
import { AxiosResponse } from 'axios';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWorkflowRejectedPercentGroupByInstance } from '../../../api/common';
import statistic from '../../../api/statistic';
import {
  IGetSqlAverageExecutionTimeV1Params,
  IGetSqlAverageExecutionTimeV1Return,
} from '../../../api/statistic/index.d';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const { tableLimit, tableColumns, tableCommonProps } = reportStatisticsData;
const param: IGetSqlAverageExecutionTimeV1Params = {
  limit: tableLimit,
};
const OrderAverageExecuteTimeTopN: React.FC = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<any[]>([]);
  const id = useRef(0);
  const onSuccess = (
    res: AxiosResponse<IGetSqlAverageExecutionTimeV1Return>
  ) => {
    setData(
      res.data.data?.map((e, i) => ({ id: String(id.current++), ...e })) ?? []
    );
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getSqlAverageExecutionTimeV1(param),
    { onSuccess }
  );
  return (
    <PanelWrapper
      loading={loading}
      title={
        <span>
          {t('reportStatistics.orderAverageExecuteTimeTopN.title', {
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
        rowKey="id"
        dataSource={data}
        columns={tableColumns.sqlExecTime()}
        {...tableCommonProps<IWorkflowRejectedPercentGroupByInstance>()}
      />
    </PanelWrapper>
  );
};

export default OrderAverageExecuteTimeTopN;
