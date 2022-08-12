import { useBoolean } from 'ahooks';
import { Result, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ITaskRejectedPercentGroupByCreator } from '../../../api/common';
import statistic from '../../../api/statistic';
import { IGetTaskRejectedPercentGroupByCreatorV1Params } from '../../../api/statistic/index.d';
import { ResponseCode } from '../../../data/common';
import reportStatisticsData from '../index.data';
import PanelWrapper from './PanelWrapper';

const { tableLimit, tableColumns, tableCommonProps } = reportStatisticsData;

const DiffUserOrderRejectedPercent: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    const getData = () => {
      startGetData();
      const param: IGetTaskRejectedPercentGroupByCreatorV1Params = {
        limit: tableLimit,
      };
      statistic
        .getTaskRejectedPercentGroupByCreatorV1(param)
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
        {...tableCommonProps<ITaskRejectedPercentGroupByCreator>()}
      />
    </PanelWrapper>
  );
};

export default DiffUserOrderRejectedPercent;
