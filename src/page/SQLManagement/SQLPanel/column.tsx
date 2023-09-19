import { Table, Tag, TagProps } from 'antd';
import { GetSqlManageListFilterStatusEnum } from '../../../api/SqlManage/index.enum';
import { IAuditResult, ISource, ISqlManage } from '../../../api/common';
import { t } from '../../../locale';
import { formatTime } from '../../../utils/Common';
import RenderExecuteSql from '../../Order/AuditResult/RenderExecuteSql';
import { sourceDictionary, statusDictionary } from './hooks/useStaticStatus';
import { Link } from '../../../components/Link';
import { SourceTypeEnum, SqlManageStatusEnum } from '../../../api/common.enum';
import AuditResultInfo from '../../Order/AuditResult/AuditResultInfo';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';

export const SQLPanelColumns: (params: { projectName: string }) => Array<
  | (ColumnGroupType<ISqlManage> | ColumnType<ISqlManage>) & {
      dataIndex?: keyof ISqlManage;
    }
> = ({ projectName }) => {
  return [
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
              to={`project/${projectName}/sqlAudit/${source.sql_audit_record_id}/detail`}
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
      dataIndex: 'first_appear_time',
      title: () => t('sqlManagement.table.firstOccurrence'),
      render: (time: string) => {
        return formatTime(time, '--');
      },
    },
    {
      dataIndex: 'last_appear_time',
      title: () => t('sqlManagement.table.lastOccurrence'),
      render: (time: string) => {
        return formatTime(time, '--');
      },
    },
    {
      dataIndex: 'appear_num',
      title: () => t('sqlManagement.table.occurrenceCount'),
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
      dataIndex: 'status',
      title: () => t('sqlManagement.table.status'),
      render: (status: SqlManageStatusEnum) => {
        if (!status) {
          return '-';
        }
        const colorDictionary: Record<
          GetSqlManageListFilterStatusEnum,
          TagProps['color']
        > = {
          [GetSqlManageListFilterStatusEnum.ignored]: 'gray',
          [GetSqlManageListFilterStatusEnum.solved]: 'green',
          [GetSqlManageListFilterStatusEnum.unhandled]: 'red',
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
    },
  ];
};
