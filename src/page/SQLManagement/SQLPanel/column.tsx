import { Space, Table, Tag, TagProps, Typography, Popover } from 'antd';
import { GetSqlManageListFilterStatusEnum } from '../../../api/SqlManage/index.enum';
import { IAuditResult, ISource, ISqlManage } from '../../../api/common';
import { t } from '../../../locale';
import { formatTime } from '../../../utils/Common';
import RenderExecuteSql from '../../Order/AuditResult/RenderExecuteSql';
import { sourceDictionary, statusDictionary } from './hooks/useStaticStatus';
import { Link } from '../../../components/Link';
import {
  BatchUpdateSqlManageReqStatusEnum,
  SourceTypeEnum,
  SqlManageStatusEnum,
} from '../../../api/common.enum';
import AuditResultInfo from '../../Order/AuditResult/AuditResultInfo';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import EditText from '../../../components/EditText/EditText';
import AssignMember from './AssignMember';
import EmptyBox from '../../../components/EmptyBox';
import UpdateSQLStatus from './UpdateSQLStatus';
import {
  SQLAuditRecordIDValuesSplit,
  SQLAuditRecordListUrlParamsKey,
} from '../../SqlAuditRecord/List/index.data';

const renderRemark = (remark: string) => (
  <Typography.Paragraph
    ellipsis={{
      expandable: false,
      tooltip: remark,
      rows: 3,
    }}
    className="margin-bottom-0"
  >
    {remark}
  </Typography.Paragraph>
);

export const SQLPanelColumns: (params: {
  projectName: string;
  updateRemark: (id: number, remark: string) => void;
  signalActionsLoading: boolean;
  signalAssignment: (
    id: number,
    members: string[]
  ) => Promise<void> | undefined;
  actionPermission: boolean;
  username: string;
  updateSQLStatus: (
    id: number,
    status: BatchUpdateSqlManageReqStatusEnum
  ) => Promise<void> | undefined;
}) => Array<
  | (ColumnGroupType<ISqlManage> | ColumnType<ISqlManage>) & {
      dataIndex?: keyof ISqlManage | 'operator';
    }
> = ({
  projectName,
  updateRemark,
  signalActionsLoading,
  signalAssignment,
  actionPermission,
  username,
  updateSQLStatus,
}) => {
  const columns: Array<
    | (ColumnGroupType<ISqlManage> | ColumnType<ISqlManage>) & {
        dataIndex?: keyof ISqlManage | 'operator';
      }
  > = [
    {
      dataIndex: 'sql_fingerprint',
      title: () => t('sqlManagement.table.SQLFingerprint'),
      className: 'table-column-sql-fingerprint',
      render: (sql: string) => <RenderExecuteSql sql={sql} rows={2} />,
    },
    {
      dataIndex: 'sql',
      title: () => 'SQL',
      className: 'table-column-sql',
      render: (sql: string) => <RenderExecuteSql sql={sql} rows={2} />,
    },
    {
      dataIndex: 'source',
      title: () => t('sqlManagement.table.source'),
      render: (source: ISource) => {
        if (source.type && source.type === SourceTypeEnum.audit_plan) {
          return (
            <Link
              to={`project/${projectName}/auditPlan/detail/${source.audit_plan_name}`}
            >
              {t(sourceDictionary[source.type])}
            </Link>
          );
        } else if (
          source.type &&
          source.type === SourceTypeEnum.sql_audit_record
        ) {
          return (
            <Link
              to={`project/${projectName}/sqlAudit?${
                SQLAuditRecordListUrlParamsKey.SQLAuditRecordID
              }=${
                source.sql_audit_record_ids?.join(
                  SQLAuditRecordIDValuesSplit
                ) ?? ''
              }`}
            >
              {t(sourceDictionary[source.type])}
            </Link>
          );
        }
        return '--';
      },
    },
    {
      dataIndex: 'instance_name',
      title: () => t('sqlManagement.table.instanceName'),
    },
    {
      dataIndex: 'audit_result',
      title: () => t('sqlManagement.table.auditResult'),
      render: (auditResult: IAuditResult[]) => {
        return <AuditResultInfo auditResult={auditResult} />;
      },
    },
    Table.EXPAND_COLUMN,
    {
      dataIndex: 'first_appear_timestamp',
      title: () => t('sqlManagement.table.firstOccurrence'),
      render: (time: string) => {
        return formatTime(time, '--');
      },
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      dataIndex: 'last_receive_timestamp',
      title: () => t('sqlManagement.table.lastOccurrence'),
      render: (time: string) => {
        return formatTime(time, '--');
      },
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      dataIndex: 'fp_count',
      title: () => t('sqlManagement.table.occurrenceCount'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },

    {
      dataIndex: 'assignees',
      title: () => t('sqlManagement.table.personInCharge'),
      render: (assignees: string[]) => {
        if (!Array.isArray(assignees)) {
          return '--';
        }
        return assignees.map((v) => <Tag key={v}>{v}</Tag>);
      },
    },
    {
      dataIndex: 'endpoints',
      title: () => t('sqlManagement.table.endpoint'),
      render: (endpoints: string[]) => {
        if (!Array.isArray(endpoints) || endpoints.length === 0) {
          return '--';
        }
        if (endpoints.length === 1) {
          return <Tag>{endpoints[0]}</Tag>;
          
        }
        return (
          <Popover content={
            <div style={{ width: '600px' }}>
              <Space wrap>{
                endpoints.map((v) => (
                  <Tag key={v}>{v}</Tag>
                ))
              }</Space>
            </div>
          }>
            <Tag>{endpoints[0]}</Tag>
            {endpoints.length > 1 ? '...' : null}
          </Popover >
        )
      }
    },
    {
      dataIndex: 'status',
      title: () => t('sqlManagement.table.status'),
      render: (status: SqlManageStatusEnum) => {
        if (!status) {
          return '--';
        }
        const colorDictionary: Record<
          GetSqlManageListFilterStatusEnum,
          TagProps['color']
        > = {
          [GetSqlManageListFilterStatusEnum.ignored]: 'gray',
          [GetSqlManageListFilterStatusEnum.solved]: 'green',
          [GetSqlManageListFilterStatusEnum.unhandled]: 'red',
          [GetSqlManageListFilterStatusEnum.manual_audited]: 'blue',
        };
        return (
          <Tag color={colorDictionary[status]}>
            {t(statusDictionary[status])}
          </Tag>
        );
      },
    },
    {
      dataIndex: 'remark',
      title: () => t('sqlManagement.table.comment'),
      width: 200,
      render: (remark: string, record) => {
        return (
          <EmptyBox if={actionPermission} defaultNode={<>{renderRemark(remark) ?? '--'}</>}>
            <EditText
              editable={{
                autoSize: true,
                onEnd: (val) => {
                  updateRemark(record.id ?? 0, val);
                },
              }}
            >
              {remark}
            </EditText>
          </EmptyBox>
        );
      },
    },

    {
      dataIndex: 'operator',
      title: () => t('common.operate'),
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space>
            <AssignMember
              projectName={projectName}
              disabled={signalActionsLoading}
              onConfirm={(members: string[]) =>
                signalAssignment(record.id ?? 0, members)
              }
            >
              <Typography.Link>
                {t('sqlManagement.table.assignMember.label')}
              </Typography.Link>
            </AssignMember>

            <UpdateSQLStatus
              disabled={signalActionsLoading}
              onConfirm={(status) => updateSQLStatus(record.id ?? 0, status)}
            >
              <Typography.Link>
                {t('sqlManagement.table.updateStatus.triggerText')}
              </Typography.Link>
            </UpdateSQLStatus>
          </Space>
        );
      },
    },
  ];
  if (!actionPermission) {
    return columns.filter((v) => v.dataIndex !== 'operator');
  }
  return columns;
};
