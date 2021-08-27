import { Button, Popconfirm, Space } from 'antd';
import { Link } from 'react-router-dom';
import { IAuditPlanResV1 } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import TokenText from './component/TokenText';

export const planListTableHeader = (
  removeAuditPlan: (auditPlanName: string) => void
): TableColumn<IAuditPlanResV1, 'operate'> => {
  return [
    {
      dataIndex: 'audit_plan_name',
      title: () => i18n.t('auditPlan.list.table.audit_plan_name'),
    },
    {
      dataIndex: 'audit_plan_cron',
      title: () => i18n.t('auditPlan.list.table.audit_plan_cron'),
    },
    {
      dataIndex: 'audit_plan_instance_name',
      title: () => i18n.t('auditPlan.list.table.audit_plan_instance_name'),
    },
    {
      dataIndex: 'audit_plan_instance_database',
      title: () => i18n.t('auditPlan.list.table.audit_plan_instance_database'),
    },
    {
      dataIndex: 'audit_plan_db_type',
      title: () => i18n.t('auditPlan.list.table.audit_plan_db_type'),
    },
    {
      dataIndex: 'audit_plan_token',
      title: () => i18n.t('auditPlan.list.table.audit_plan_token'),
      render: (text) => {
        return <TokenText token={text} />;
      },
    },
    {
      dataIndex: 'operate',
      title: () => i18n.t('common.operate'),
      render: (_, record) => {
        return (
          <Space
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Link
              type="link"
              to={`/auditPlan/update/${record.audit_plan_name}`}
            >
              {i18n.t('common.edit')}
            </Link>
            <Popconfirm
              title={i18n.t('auditPlan.remove.confirm', {
                name: record.audit_plan_name,
              })}
              onConfirm={() => removeAuditPlan(record.audit_plan_name ?? '')}
            >
              <Button type="link" danger>
                {i18n.t('common.delete')}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};
