import { useBoolean } from 'ahooks';
import { Result, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ITaskRejectedPercentGroupByInstance } from '../../../api/common';
import statistic from '../../../api/statistic';
import { IGetTaskRejectedPercentGroupByInstanceV1Params } from '../../../api/statistic/index.d';
import { ResponseCode } from '../../../data/common';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';

const { tableLimit, tableColumns, tableCommonProps } = reportStatisticsData;

const DiffInstanceOrderRejectedPercent: React.FC = () => {
  const { t } = useTranslation();
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const getData = () => {
      startGetData();
      const param: IGetTaskRejectedPercentGroupByInstanceV1Params = {
        limit: tableLimit,
      };
      statistic
        .getTaskRejectedPercentGroupByInstanceV1(param)
        .then((res) => {
          if (res.data.code !== ResponseCode.SUCCESS) {
            setErrorMessage(res.data.message ?? t('common.unknownError'));
          } else {
            setErrorMessage('');
            setData(res.data.data ?? []);
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
        {...tableCommonProps<ITaskRejectedPercentGroupByInstance>()}
      />
    </PanelWrapper>
  );
};

export default DiffInstanceOrderRejectedPercent;
