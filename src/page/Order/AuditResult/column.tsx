import { Space, Tag, Typography } from 'antd';
import {
  IAuditTaskSQLResV1,
  IGetWorkflowTasksItemV1,
} from '../../../api/common';
import {
  getAuditTaskSQLsV1FilterAuditStatusEnum,
  getAuditTaskSQLsV1FilterExecStatusEnum,
} from '../../../api/task/index.enum';
import AuditResultErrorMessage from '../../../components/AuditResultErrorMessage';
import EditText from '../../../components/EditText/EditText';
import EmptyBox from '../../../components/EmptyBox';
import OrderStatusTag from '../../../components/OrderStatusTag';
import {
  auditStatusDictionary,
  execStatusDictionary,
} from '../../../hooks/useStaticStatus/index.data';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import HighlightCode from '../../../utils/HighlightCode';
import { floatToPercent } from '../../../utils/Math';

export const orderAuditResultColumn = (
  updateSqlDescribe: (sqlNum: number, sqlDescribe: string) => void,
  clickAnalyze: (sqlNum: number) => void
): TableColumn<IAuditTaskSQLResV1, 'operator'> => {
  return [
    {
      dataIndex: 'number',
      title: () => i18n.t('audit.table.number'),
    },
    {
      dataIndex: 'audit_status',
      title: () => i18n.t('audit.table.auditStatus'),
      render: (status: getAuditTaskSQLsV1FilterAuditStatusEnum) => {
        return status ? i18n.t(auditStatusDictionary[status]) : '';
      },
    },
    {
      dataIndex: 'audit_result',
      title: () => i18n.t('audit.table.auditResult'),
      render: (errorMessage) => {
        return <AuditResultErrorMessage resultErrorMessage={errorMessage} />;
      },
    },
    {
      dataIndex: 'exec_sql',
      title: () => i18n.t('audit.table.execSql'),
      render: (sql?: string) => {
        if (!!sql) {
          return (
            <pre
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(sql),
              }}
              className="pre-warp-break-all"
            ></pre>
          );
        }
        return null;
      },
    },
    {
      dataIndex: 'exec_status',
      title: () => i18n.t('audit.table.execStatus'),
      render: (status: getAuditTaskSQLsV1FilterExecStatusEnum) => {
        return status ? i18n.t(execStatusDictionary[status]) : '';
      },
    },
    {
      dataIndex: 'exec_result',
      title: () => i18n.t('audit.table.execResult'),
    },
    {
      dataIndex: 'rollback_sql',
      title: () => i18n.t('audit.table.rollback'),
      render: (sql?: string) => {
        if (!!sql) {
          return (
            <pre
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(sql),
              }}
              className="pre-warp-break-all"
            ></pre>
          );
        }
        return null;
      },
    },
    {
      dataIndex: 'description',
      title: () => i18n.t('audit.table.describe'),
      width: '200px',
      render: (description: string, record) => {
        return (
          <EditText
            editable={{
              autoSize: true,
              onEnd: (val) => {
                updateSqlDescribe(record.number ?? 0, val);
              },
            }}
          >
            {description}
          </EditText>
        );
      },
    },
    /* IFTRUE_isEE */
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      width: '70px',
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => clickAnalyze(record.number ?? 0)}>
            {i18n.t('audit.table.analyze')}
          </Typography.Link>
        );
      },
    },
    /* FITRUE_isEE */
  ];
};

export const auditResultOverviewColumn: (
  sqlExecuteHandle: (taskId: string) => void,
  openScheduleModal: (taskId: string) => void,
  scheduleTimeHandle: (scheduleTime?: string) => Promise<void>
) => TableColumn<IGetWorkflowTasksItemV1, 'operator'> = (
  sqlExecuteHandle,
  openScheduleModal,
  scheduleTimeHandle
) => {
  return [
    {
      dataIndex: 'instance_name',
      title: () => i18n.t('order.auditResultCollection.table.instanceName'),
    },
    {
      dataIndex: 'status',
      title: () => i18n.t('order.auditResultCollection.table.status'),
      render: (status) => <OrderStatusTag status={status} />,
    },
    {
      dataIndex: 'exec_start_time',
      title: () => i18n.t('order.auditResultCollection.table.execStartTime'),
    },
    {
      dataIndex: 'exec_end_time',
      title: () => i18n.t('order.auditResultCollection.table.execEndTime'),
    },
    {
      dataIndex: 'schedule_time',
      title: () =>
        i18n.t('order.auditResultCollection.table.scheduleExecuteTime'),
    },
    {
      dataIndex: 'current_step_assignee_user_name_list',
      title: () => i18n.t('order.auditResultCollection.table.assigneeUserName'),
      render: (names: string[] = []) => names.map((v) => <Tag>{v}</Tag>),
    },
    {
      dataIndex: 'task_pass_rate',
      title: () => i18n.t('order.auditResultCollection.table.passRate'),
      render: (rate: number = 0) => `${floatToPercent(rate)}%`,
    },
    {
      dataIndex: 'task_score',
      title: () => i18n.t('order.auditResultCollection.table.score'),
    },
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      render: (_, record) => {
        const taskId = record.task_id?.toString() ?? '';
        return (
          <Space>
            <Typography.Link onClick={() => sqlExecuteHandle(taskId)}>
              {i18n.t('order.auditResultCollection.table.sqlExecute')}
            </Typography.Link>
            <Typography.Link onClick={() => openScheduleModal(taskId)}>
              {i18n.t('order.auditResultCollection.table.scheduleTime')}
            </Typography.Link>
            <EmptyBox if={!!record.schedule_time}>
              <Typography.Link onClick={() => scheduleTimeHandle()}>
                {i18n.t(
                  'order.auditResultCollection.table.cancelExecScheduled'
                )}
              </Typography.Link>
            </EmptyBox>
          </Space>
        );
      },
    },
  ];
};
