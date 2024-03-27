import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, Space, Switch, Table, Typography } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import task from '../../../api/task';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import useTable from '../../../hooks/useTable';
import { floatToPercent } from '../../../utils/Math';
import AuditResultFilterForm from './AuditResultFilterForm';
import {
  orderAuditResultColumn,
  expandedRowRender,
  AuditResultRecordColumn,
} from './column';
import { AuditResultProps, OrderAuditResultFilterFields } from './index.type';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const AuditResult: React.FC<AuditResultProps> = (props) => {
  const { t } = useTranslation();
  const { mode = "order", getResultCallBack } = props;
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
      task
        .getAuditTaskSQLsV2({
          task_id: `${props.taskId}`,
          ...filterInfo,
          page_index: pagination.pageIndex.toString(),
          page_size: pagination.pageSize.toString(),
          no_duplicate: duplicate,
        })
        .then((res) => {
          getResultCallBack?.();
          return {
            list: res.data.data,
            total: res.data.total_nums,
          };
        }),
    {
      manual: true,
      onSuccess(res) {
        const taskStr = props.taskId ? `${props.taskId}` : '';
        props.updateTaskRecordTotalNum?.(taskStr, res.total ?? 0);
      },
      onError() {
        const taskStr = props.taskId ? `${props.taskId}` : '';
        props.updateTaskRecordTotalNum?.(taskStr, 0);
      },
    }
  );

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
    window.open(
      `/project/${props.projectName}/order/${props.taskId}/${sqlNum}/analyze`
    );
  };

  const cardProps = useMemo(() => {
    const downloadSql = () => {
      task.downloadAuditTaskSQLFileV1(
        {
          task_id: `${props.taskId}`,
        },
        { responseType: 'blob' }
      );
    };

    const downloadReport = () => {
      task.downloadAuditTaskSQLReportV1(
        {
          task_id: `${props.taskId}`,
          no_duplicate: duplicate,
        },
        { responseType: 'blob' }
      );
    };

    return mode === 'auditRecordDetail'
      ? undefined
      : {
          title: (
            <Space>
              {t('audit.result')}
              <Typography.Text type="secondary" className="font-size-small">
                {t('audit.passRage')}
                <EmptyBox if={props.passRate !== undefined}>
                  {floatToPercent(props.passRate ?? 0)}%
                </EmptyBox>
              </Typography.Text>
              <Typography.Text type="secondary" className="font-size-small">
                {t('audit.source')}
                <EmptyBox if={props.auditScore !== undefined}>
                  {props.auditScore ?? 0}
                </EmptyBox>
              </Typography.Text>

              <Typography.Text type="secondary" className="font-size-small">
                <EmptyBox if={!!props.instanceSchema}>
                  {props.instanceSchema}
                </EmptyBox>
              </Typography.Text>
            </Space>
          ),
          extra: [
            <Space key="duplicate">
              <Button onClick={downloadReport}>
                {t('audit.downloadReport')}
              </Button>
              <Button onClick={downloadSql}>{t('audit.downloadSql')}</Button>
              {t('audit.duplicate')}
              <Switch onChange={toggleDuplicate} />
            </Space>,
          ],
        };
  }, [
    duplicate,
    mode,
    props.auditScore,
    props.instanceSchema,
    props.passRate,
    props.taskId,
    t,
    toggleDuplicate,
  ]);

  useEffect(() => {
    if (props.taskId !== undefined) {
      getAuditTaskSql();
    }
  }, [pagination, filterInfo, duplicate, props.taskId, getAuditTaskSql]);

  return (
    <Card {...cardProps} id="audit-result-task-card">
      <AuditResultFilterForm
        form={filterForm}
        submit={submitFilter}
        reset={resetFilter}
        mode={mode}
      />
      <Table
        rowKey="number"
        loading={loading}
        pagination={{
          total: data?.total,
          showSizeChanger: true,
          current: pagination.pageIndex,
        }}
        columns={
          mode === "order"
            ? orderAuditResultColumn(updateSqlDescribe, handleClickAnalyze)
            : AuditResultRecordColumn(updateSqlDescribe, handleClickAnalyze)
        }
        dataSource={data?.list}
        onChange={tableChange}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) =>
            !!record.audit_result && record.audit_result.length > 1,
          expandIcon: ({ expanded, onExpand, record }) =>
            !!record.audit_result && record.audit_result.length > 1 ? (
              expanded ? (
                <UpOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <DownOutlined onClick={(e) => onExpand(record, e)} />
              )
            ) : null,
          columnWidth: 14,
        }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default AuditResult;
