import { Popconfirm, Space, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import {
  IAuditResult,
  IAuditTaskSQLResV2,
  IGetWorkflowTasksItemV2,
  IMaintenanceTimeResV1,
} from '../../../api/common';
import {
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowRecordResV2StatusEnum,
} from '../../../api/common.enum';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '../../../api/task/index.enum';
import AuditResultErrorMessage from '../../../components/AuditResultErrorMessage';
import EditText from '../../../components/EditText/EditText';
import EmptyBox from '../../../components/EmptyBox';
import { execStatusDictionary } from '../../../hooks/useStaticStatus/index.data';
import { t } from '../../../locale';
import IconTipsLabel from '../../../components/IconTipsLabel';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';
import { floatToPercent } from '../../../utils/Math';
import { checkTimeInWithMaintenanceTime } from '../Detail/OrderSteps/utils';
import InstanceTasksStatus from './InstanceTasksStatus';
import AuditResultInfo from './AuditResultInfo';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import RenderExecuteSql from './RenderExecuteSql';

export const expandedRowRender = (record: IAuditTaskSQLResV2) => (
  <AuditResultErrorMessage auditResult={record?.audit_result ?? []} />
);

export const ORDER_OPERATE_COLUMN_ID = 'ORDER_OPERATE_COLUMN_ID';

export const orderAuditResultColumn = (
  updateSqlDescribe: (sqlNum: number, sqlDescribe: string) => void,
  clickAnalyze: (sqlNum: number) => void
): Array<
  | (ColumnGroupType<IAuditTaskSQLResV2> | ColumnType<IAuditTaskSQLResV2>) & {
      dataIndex?: keyof IAuditTaskSQLResV2 | 'operator';
    }
> => {
  return [
    {
      dataIndex: 'number',
      title: () => t('audit.table.number'),
      width: 60,
    },
    {
      dataIndex: 'exec_sql',
      title: () => t('audit.table.execSql'),
      width: 300,
      render: (sql?: string) => {
        return <RenderExecuteSql sql={sql} />;
      },
    },
    {
      dataIndex: 'audit_result',
      title: () => t('audit.table.auditResult'),
      width: 200,
      render: (auditResult: IAuditResult[]) => {
        return <AuditResultInfo auditResult={auditResult} />;
      },
    },
    Table.EXPAND_COLUMN,
    {
      dataIndex: 'exec_status',
      title: () => t('audit.table.execStatus'),
      render: (status: getAuditTaskSQLsV2FilterExecStatusEnum) => {
        return status ? t(execStatusDictionary[status]) : '';
      },
      width: 100,
    },
    {
      dataIndex: 'exec_result',
      title: () => t('audit.table.execResult'),
      width: 140,
      render(execResult: string) {
        return (
          <Typography.Paragraph
            ellipsis={{
              expandable: false,
              tooltip: execResult,
              rows: 3,
            }}
            className="margin-bottom-0"
          >
            {execResult}
          </Typography.Paragraph>
        );
      },
    },
    {
      dataIndex: 'rollback_sql',
      title: () => (
        <Space>
          <span>{t('audit.table.rollback')}</span>
          <IconTipsLabel tips={t('audit.table.rollbackTips')} />
        </Space>
      ),
      width: 300,
      render: (sql?: string) => {
        return <RenderExecuteSql sql={sql} />;
      },
    },
    {
      dataIndex: 'description',
      title: () => t('audit.table.describe'),
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
      title: () => t('common.operate'),
      width: '70px',
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => clickAnalyze(record.number ?? 0)}>
            {t('audit.table.analyze')}
          </Typography.Link>
        );
      },
    },
    /* FITRUE_isEE */
  ];
};

export const auditResultOverviewColumn: (
  sqlExecuteHandle: (taskId: string) => void,
  sqlTerminateHandle: (taskId: string) => void,
  openScheduleModalAndSetCurrentTask: (record: IGetWorkflowTasksItemV2) => void,
  scheduleTimeHandle: (
    scheduleTime?: string | undefined,
    taskId?: string
  ) => Promise<void>,
  currentUserName: string,
  orderStatus?: WorkflowRecordResV2StatusEnum
) => TableColumn<IGetWorkflowTasksItemV2, 'operator'> = (
  sqlExecuteHandle,
  sqlTerminateHandle,
  openScheduleModalAndSetCurrentTask,
  scheduleTimeHandle,
  currentUsername,
  orderStatus
) => {
  const unusableStatus = [
    WorkflowRecordResV2StatusEnum.rejected,
    WorkflowRecordResV2StatusEnum.canceled,
    WorkflowRecordResV2StatusEnum.finished,
  ];

  const enableSqlExecute = (
    currentStepAssigneeUsernameList: string[] = [],
    status?: GetWorkflowTasksItemV2StatusEnum,
    maintenanceTime: IMaintenanceTimeResV1[] = []
  ) => {
    if (
      !status ||
      unusableStatus.includes(orderStatus as WorkflowRecordResV2StatusEnum) ||
      !currentStepAssigneeUsernameList.includes(currentUsername)
    ) {
      return false;
    }

    if (maintenanceTime.length) {
      return checkTimeInWithMaintenanceTime(moment(), maintenanceTime);
    }

    return status === GetWorkflowTasksItemV2StatusEnum.wait_for_execution;
  };

  const enableSqlScheduleTime = (
    currentStepAssigneeUsernameList: string[] = [],
    status?: GetWorkflowTasksItemV2StatusEnum
  ) => {
    if (
      !status ||
      unusableStatus.includes(orderStatus as WorkflowRecordResV2StatusEnum) ||
      !currentStepAssigneeUsernameList.includes(currentUsername)
    ) {
      return false;
    }

    return status === GetWorkflowTasksItemV2StatusEnum.wait_for_execution;
  };

  const enableCancelSqlScheduleTime = (
    status?: GetWorkflowTasksItemV2StatusEnum
  ) => {
    if (
      !status ||
      unusableStatus.includes(orderStatus as WorkflowRecordResV2StatusEnum)
    ) {
      return false;
    }
    return status === GetWorkflowTasksItemV2StatusEnum.exec_scheduled;
  };
  return [
    {
      dataIndex: 'instance_name',
      title: () => t('order.auditResultCollection.table.instanceName'),
    },
    {
      dataIndex: 'status',
      title: () => t('order.auditResultCollection.table.status'),
      render: (status: GetWorkflowTasksItemV2StatusEnum) => (
        <InstanceTasksStatus status={status} />
      ),
    },
    {
      dataIndex: 'task_pass_rate',
      title: () => t('order.auditResultCollection.table.passRate'),
      render: (rate: number = 0) => `${floatToPercent(rate)}%`,
    },
    {
      dataIndex: 'task_score',
      title: () => t('order.auditResultCollection.table.score'),
    },
    {
      dataIndex: 'current_step_assignee_user_name_list',
      title: () => t('order.auditResultCollection.table.assigneeUserName'),
      render: (names: string[] = []) =>
        names.map((v) => <Tag key={v}>{v}</Tag>),
    },
    {
      dataIndex: 'execution_user_name',
      title: () => t('order.auditResultCollection.table.executeUserName'),
    },
    {
      dataIndex: 'exec_start_time',
      title: () => t('order.auditResultCollection.table.execStartTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'exec_end_time',
      title: () => t('order.auditResultCollection.table.execEndTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'schedule_time',
      title: () => t('order.auditResultCollection.table.scheduleExecuteTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'operator',
      title: () => t('common.operate'),
      render: (_, record) => {
        const taskId = record.task_id?.toString() ?? '';
        if (record.status === GetWorkflowTasksItemV2StatusEnum.executing) {
          return (
            <Popconfirm
              title={t('order.operator.terminateConfirmTips')}
              overlayClassName="popconfirm-small"
              placement="topRight"
              okText={t('common.ok')}
              disabled={
                !record.current_step_assignee_user_name_list?.includes(
                  currentUsername
                )
              }
              onConfirm={(e) => {
                e?.stopPropagation();
                sqlTerminateHandle(taskId);
              }}
              onCancel={(e) => {
                e?.stopPropagation();
              }}
            >
              <Typography.Link
                type="danger"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                disabled={
                  !record.current_step_assignee_user_name_list?.includes(
                    currentUsername
                  )
                }
              >
                {t('order.operator.terminate')}
              </Typography.Link>
            </Popconfirm>
          );
        }
        return (
          <div id="ORDER_OPERATE_COLUMN_ID" style={{ cursor: 'default' }}>
            <Popconfirm
              overlayClassName="popconfirm-small"
              placement="topRight"
              okText={t('common.ok')}
              disabled={
                !enableSqlExecute(
                  record.current_step_assignee_user_name_list,
                  record.status,
                  record.instance_maintenance_times
                )
              }
              title={t(
                'order.auditResultCollection.table.sqlExecuteConfirmTips'
              )}
              onConfirm={(e) => {
                e?.stopPropagation();
                sqlExecuteHandle(taskId);
              }}
              onCancel={(e) => {
                e?.stopPropagation();
              }}
            >
              <Typography.Link
                style={{ marginRight: 8 }}
                disabled={
                  !enableSqlExecute(
                    record.current_step_assignee_user_name_list,
                    record.status,
                    record.instance_maintenance_times
                  )
                }
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {t('order.auditResultCollection.table.sqlExecute')}
              </Typography.Link>
            </Popconfirm>

            <EmptyBox
              if={
                record.status ===
                GetWorkflowTasksItemV2StatusEnum.exec_scheduled
              }
              defaultNode={
                <Typography.Link
                  disabled={
                    !enableSqlScheduleTime(
                      record.current_step_assignee_user_name_list,
                      record.status
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    openScheduleModalAndSetCurrentTask(record);
                  }}
                >
                  {t('order.auditResultCollection.table.scheduleTime')}
                </Typography.Link>
              }
            >
              <Typography.Link
                disabled={!enableCancelSqlScheduleTime(record.status)}
                onClick={(e) => {
                  e.stopPropagation();
                  scheduleTimeHandle(
                    undefined,
                    record.task_id?.toString() ?? ''
                  );
                }}
              >
                {t('order.auditResultCollection.table.cancelExecScheduled')}
              </Typography.Link>
            </EmptyBox>
          </div>
        );
      },
    },
  ];
};
