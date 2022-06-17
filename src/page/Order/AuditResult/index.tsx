import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, Space, Switch, Table, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import task from '../../../api/task';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import useTable from '../../../hooks/useTable';
import { orderAuditResultColumn } from './column';
import FilterForm from './FilterForm';
import { OrderAuditResultFilterFields } from './FilterForm/index.type';
import { AuditResultProps } from './index.type';

const AuditResult: React.FC<AuditResultProps> = (props) => {
  const { t } = useTranslation();

  const [duplicate, { toggle: toggleDuplicate }] = useBoolean();

  const {
    filterInfo,
    pagination,
    tableChange,
    filterForm,
    submitFilter,
    resetFilter,
  } = useTable<OrderAuditResultFilterFields>();

  const {
    data,
    loading,
    run: getAuditTaskSql,
  } = useRequest(
    () =>
      task.getAuditTaskSQLsV1({
        task_id: `${props.taskId}`,
        ...filterInfo,
        page_index: pagination.pageIndex.toString(),
        page_size: pagination.pageSize.toString(),
        no_duplicate: duplicate,
      }),
    {
      manual: true,
      formatResult(res) {
        return {
          list: res.data.data,
          total: res.data.total_nums,
        };
      },
      onSuccess(res) {
        props.updateTaskRecordTotalNum?.(res.total ?? 0);
      },
      onError() {
        props.updateTaskRecordTotalNum?.(0);
      },
    }
  );

  const downloadSql = () => {
    task.downloadAuditTaskSQLFileV1({
      task_id: `${props.taskId}`,
    });
  };

  const downloadReport = () => {
    task.downloadAuditTaskSQLReportV1({
      task_id: `${props.taskId}`,
      no_duplicate: duplicate,
    });
  };

  const updateSqlDescribeProtect = useRef(false);
  const updateSqlDescribe = (sqlNum: number, sqlDescribe: string) => {
    if (updateSqlDescribeProtect.current) {
      return;
    }
    updateSqlDescribeProtect.current = true;
    task
      .updateAuditTaskSQLsV1({
        number: `${sqlNum}`,
        description: sqlDescribe,
        task_id: `${props.taskId}`,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          getAuditTaskSql();
        }
      })
      .finally(() => {
        updateSqlDescribeProtect.current = false;
      });
  };

  const handleClickAnalyze = (sqlNum: number) => {
    window.open(`/order/${props.taskId}/${sqlNum}/analyze`);
  };

  useEffect(() => {
    if (props.taskId !== undefined) {
      getAuditTaskSql();
    }
  }, [pagination, filterInfo, duplicate, props.taskId, getAuditTaskSql]);

  return (
    <Card
      title={
        <Space>
          {t('audit.result')}
          <Typography.Text type="secondary" className="font-size-small">
            {t('audit.passRage')}
            <EmptyBox if={props.passRate !== undefined}>
              {(props.passRate ?? 0) * 100}%
            </EmptyBox>
          </Typography.Text>
          <Typography.Text type="secondary" className="font-size-small">
            {t('audit.source')}
            <EmptyBox if={props.auditScore !== undefined}>
              {props.auditScore ?? 0}
            </EmptyBox>
          </Typography.Text>
        </Space>
      }
      extra={[
        <Space key="duplicate">
          <Button onClick={downloadReport}>{t('audit.downloadReport')}</Button>
          <Button onClick={downloadSql}>{t('audit.downloadSql')}</Button>
          {t('audit.duplicate')}
          <Switch onChange={toggleDuplicate} />
        </Space>,
      ]}
    >
      <FilterForm form={filterForm} submit={submitFilter} reset={resetFilter} />
      <Table
        rowKey="number"
        loading={loading}
        pagination={{
          total: data?.total,
          showSizeChanger: true,
        }}
        columns={orderAuditResultColumn(updateSqlDescribe, handleClickAnalyze)}
        dataSource={data?.list}
        onChange={tableChange}
      />
    </Card>
  );
};

export default AuditResult;
