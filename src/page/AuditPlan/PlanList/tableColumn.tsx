import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Popconfirm, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IAuditPlanMetaV1, IAuditPlanResV2 } from '../../../api/common';
import IconTipsLabel from '../../../components/IconTipsLabel';
import { ModalName } from '../../../data/ModalName';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { RuleUrlParamKey } from '../../Rule/useRuleFilterForm';
import TokenText from './component/TokenText';

export const planListTableHeader = (
  removeAuditPlan: (auditPlanName: string) => void,
  openModal: (name: ModalName, row?: IAuditPlanResV2) => void,
  projectName: string,
  projectIsArchive: boolean
): TableColumn<IAuditPlanResV2, 'operate'> => {
  const column: TableColumn<IAuditPlanResV2, 'operate'> = [
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
      dataIndex: 'rule_template',
      title: () => i18n.t('auditPlan.list.table.audit_rule_template'),
      render(ruleTemplate: IAuditPlanResV2['rule_template']) {
        if (!ruleTemplate?.name) {
          return '';
        }

        const path = ruleTemplate.is_global_rule_template
          ? `/rule?${RuleUrlParamKey.ruleTemplateName}=${ruleTemplate.name}`
          : `/rule?${RuleUrlParamKey.projectName}=${projectName}&${RuleUrlParamKey.ruleTemplateName}=${ruleTemplate.name}`;

        return <Link to={path}>{ruleTemplate.name}</Link>;
      },
    },
    {
      dataIndex: 'audit_plan_token',
      title: () => (
        <>
          <IconTipsLabel
            tips={i18n.t('auditPlan.list.table.audit_plan_token_tips')}
          >
            {i18n.t('auditPlan.list.table.audit_plan_token')}
          </IconTipsLabel>
        </>
      ),
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

  if (projectIsArchive) {
    return column.filter((v) => v.dataIndex !== 'operate');
  }

  return column;
};
