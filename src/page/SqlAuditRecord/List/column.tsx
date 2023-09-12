import { Tag, Tooltip } from 'antd';
import { Link } from '../../../components/Link';
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';
import { floatRound, floatToPercent } from '../../../utils/Math';
import { ISQLAuditRecord } from '../../../api/common';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '../../../api/sql_audit_record/index.enum';
import CustomTags from './CustomTags';

export const SQLAuditListColumn = (
  projectName: string,
  updateTags: (id: string, tags: string[]) => Promise<void>
): TableColumn<
  ISQLAuditRecord,
  'instance_name' | 'pass_rate' | 'score' | 'audit_time'
> => {
  return [
    {
      dataIndex: 'sql_audit_record_id',
      title: () => t('sqlAudit.list.table.columns.auditID'),
      render: (id: string) => {
        if (!id) {
          return '-';
        }

        return (
          <Link to={`project/${projectName}/sqlAudit/${id}/detail`}>{id}</Link>
        );
      },
      width: 200,
    },
    {
      dataIndex: 'instance_name',
      title: () => t('sqlAudit.list.table.columns.instanceName'),
      render: (_, record) => {
        if (!record.task?.instance_name) {
          return '-';
        }

        return <Tooltip title={``}>{record.task?.instance_name}</Tooltip>;
      },
      width: 200,
    },
    {
      dataIndex: 'sql_audit_status',
      title: () => t('sqlAudit.list.table.columns.auditStatus'),
      render: (status: getSQLAuditRecordsV1FilterSqlAuditStatusEnum) => {
        if (status === getSQLAuditRecordsV1FilterSqlAuditStatusEnum.auditing) {
          return <Tag color="blue">{t('sqlAudit.list.auditing')}</Tag>;
        } else if (
          status === getSQLAuditRecordsV1FilterSqlAuditStatusEnum.successfully
        ) {
          return <Tag color="green">{t('sqlAudit.list.successfully')}</Tag>;
        }

        return <Tag color="red">{t('common.unknownStatus')}</Tag>;
      },
      width: 160,
    },
    {
      dataIndex: 'tags',
      title: () => t('sqlAudit.list.table.columns.businessTag'),
      render: (tags: string[], record) => {
        if (!Array.isArray(tags)) {
          return '-';
        }

        return (
          <CustomTags
            projectName={projectName}
            tags={tags}
            updateTags={() => updateTags(`${record.sql_audit_record_id}`, tags)}
          />
        );
      },
    },
    {
      dataIndex: 'score',
      title: () => t('sqlAudit.list.table.columns.auditRating'),
      render: (_, record) => {
        const score = record.task?.score;
        return typeof score === 'number' ? floatRound(score) : '-';
      },
      width: 100,
    },
    {
      dataIndex: 'pass_rate',
      title: () => t('sqlAudit.list.table.columns.auditPassRate'),
      render: (_, record) => {
        const rate = record.task?.pass_rate;
        return typeof rate === 'number' ? floatToPercent(rate) : '-';
      },
      width: 160,
    },
    {
      dataIndex: 'creator',
      title: () => t('sqlAudit.list.table.columns.createUser'),
    },
    {
      dataIndex: 'audit_time',
      title: () => t('sqlAudit.list.table.columns.auditTime'),
      render(_, record) {
        return formatTime(record.task?.exec_start_time, '-');
      },
      width: 200,
    },
  ];
};
