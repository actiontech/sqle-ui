import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Popconfirm, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IAuditPlanMetaV1, IAuditPlanResV1 } from '../../../api/common';
import { ModalName } from '../../../data/ModalName';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import TokenText from './component/TokenText';

export const planListTableHeader = (
  removeAuditPlan: (auditPlanName: string) => void,
  openModal: (name: ModalName, row?: IAuditPlanResV1) => void,
  projectName: string
): TableColumn<IAuditPlanResV1, 'operate'> => {
  return [
    {
      dataIndex: 'audit_plan_name',
      title: () => i18n.t('auditPlan.list.table.audit_plan_name'),
      render: (text: string) => {
        return (
          <Link to={`/project/${projectName}/auditPlan/detail/${text}`}>
            {text}
          </Link>
        );
      },
    },
    {
      dataIndex: 'audit_plan_meta',
      title: () => i18n.t('auditPlan.list.table.audit_plan_type'),
      render: (meta: IAuditPlanMetaV1) => {
        return meta?.audit_plan_type_desc;
      },
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
      dataIndex: 'rule_template_name',
      title: () => i18n.t('auditPlan.list.table.audit_rule_template'),
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
              to={`/project/${projectName}/auditPlan/update/${record.audit_plan_name}`}
            >
              {i18n.t('common.edit')}
            </Link>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item key="remove">
                    <Popconfirm
                      placement="topLeft"
                      title={i18n.t('auditPlan.remove.confirm', {
                        name: record.audit_plan_name,
                      })}
                      onConfirm={() =>
                        removeAuditPlan(record.audit_plan_name ?? '')
                      }
                    >
                      <div
                        className="text-red"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {i18n.t('common.delete')}
                      </div>
                    </Popconfirm>
                  </Menu.Item>
                  <Menu.Item
                    key="subscribe"
                    onClick={() =>
                      openModal(ModalName.Subscribe_Notice, record)
                    }
                  >
                    {i18n.t('auditPlan.list.operator.notice')}
                  </Menu.Item>
                </Menu>
              }
            >
              <Typography.Link className="pointer">
                {i18n.t('common.more')}
                <DownOutlined />
              </Typography.Link>
            </Dropdown>
          </Space>
        );
      },
    },
  ];
};
