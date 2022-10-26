import { Result, Table } from 'antd';
import { AxiosResponse } from 'axios';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IWorkflowRejectedPercentGroupByInstance } from '../../../api/common';
import statistic from '../../../api/statistic';
import {
  IGetSqlExecutionFailPercentV1Params,
  IGetSqlExecutionFailPercentV1Return,
} from '../../../api/statistic/index.d';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';
import usePanelCommonRequest from './usePanelCommonRequest';

const { tableLimit, tableColumns, tableCommonProps } = reportStatisticsData;
const param: IGetSqlExecutionFailPercentV1Params = {
  limit: tableLimit,
};
const SqlExecFailedTopN: React.FC = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<any[]>([]);
  const id = useRef(0);
  const onSuccess = (
    res: AxiosResponse<IGetSqlExecutionFailPercentV1Return>
  ) => {
    setData(
      res.data.data?.map((e) => ({ id: String(id.current++), ...e })) ?? []
    );
  };

  const { loading, errorMessage } = usePanelCommonRequest(
    () => statistic.getSqlExecutionFailPercentV1(param),
    { onSuccess }
  );
  return (
    <PanelWrapper
      loading={loading}
      title={
        <span>
          {t('reportStatistics.sqlExecFailedTopN.title', {
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
        columns={tableColumns.sqlExecFailed()}
        {...tableCommonProps<IWorkflowRejectedPercentGroupByInstance>()}
      />
    </PanelWrapper>
  );
};

export default SqlExecFailedTopN;
