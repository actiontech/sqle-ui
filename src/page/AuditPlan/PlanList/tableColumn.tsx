import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Popconfirm, Space, Typography } from 'antd';
import { IAuditPlanMetaV1, IAuditPlanResV2 } from '../../../api/common';
import IconTipsLabel from '../../../components/IconTipsLabel';
import { ModalName } from '../../../data/ModalName';
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { RuleUrlParamKey } from '../../Rule/useRuleFilterForm';
import TokenText from './component/TokenText';
import { Link } from '../../../components/Link';
import DatabaseTypeLogo from '../../../components/DatabaseTypeLogo';

export const planListTableHeader = (
  removeAuditPlan: (auditPlanName: string) => void,
  openModal: (name: ModalName, row?: IAuditPlanResV2) => void,
  projectName: string,
  projectIsArchive: boolean
): TableColumn<IAuditPlanResV2, 'operate'> => {
  const column: TableColumn<IAuditPlanResV2, 'operate'> = [
    {
      dataIndex: 'audit_plan_name',
      title: () => t('auditPlan.list.table.audit_plan_name'),
      render: (text: string) => {
        return (
          <Link to={`project/${projectName}/auditPlan/detail/${text}`}>
            {text}
          </Link>
        );
      },
    },
    {
      dataIndex: 'audit_plan_meta',
      title: () => t('auditPlan.list.table.audit_plan_type'),
      render: (meta: IAuditPlanMetaV1) => {
        return meta?.audit_plan_type_desc;
      },
    },
    {
      dataIndex: 'audit_plan_cron',
      title: () => t('auditPlan.list.table.audit_plan_cron'),
    },
    {
      dataIndex: 'audit_plan_instance_name',
      title: () => t('auditPlan.list.table.audit_plan_instance_name'),
    },
    {
      dataIndex: 'audit_plan_instance_database',
      title: () => t('auditPlan.list.table.audit_plan_instance_database'),
    },
    {
      dataIndex: 'audit_plan_db_type',
      title: () => t('auditPlan.list.table.audit_plan_db_type'),
      render(type: string) {
        if (!type) {
          return '--';
        }

        return <DatabaseTypeLogo dbType={type} />;
      },
    },
    {
      dataIndex: 'rule_template',
      title: () => t('auditPlan.list.table.audit_rule_template'),
      render(ruleTemplate: IAuditPlanResV2['rule_template']) {
        if (!ruleTemplate?.name) {
          return '';
        }

        const path = ruleTemplate.is_global_rule_template
          ? `rule?${RuleUrlParamKey.ruleTemplateName}=${ruleTemplate.name}`
          : `rule?${RuleUrlParamKey.projectName}=${projectName}&${RuleUrlParamKey.ruleTemplateName}=${ruleTemplate.name}`;

        return <Link to={path}>{ruleTemplate.name}</Link>;
      },
    },
    {
      dataIndex: 'audit_plan_token',
      title: () => (
        <>
          <IconTipsLabel tips={t('auditPlan.list.table.audit_plan_token_tips')}>
            {t('auditPlan.list.table.audit_plan_token')}
          </IconTipsLabel>
        </>
      ),
      render: (text) => {
        return <TokenText token={text} />;
      },
    },
    {
      dataIndex: 'operate',
      title: () => t('common.operate'),
      width: 120,
      render: (_, record) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'remove',
            label: (
              <Popconfirm
                placement="topLeft"
                title={t('auditPlan.remove.confirm', {
                  name: record.audit_plan_name,
                })}
                onConfirm={() => removeAuditPlan(record.audit_plan_name ?? '')}
              >
                <div
                  className="text-red"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {t('common.delete')}
                </div>
              </Popconfirm>
            ),
          },

          {
            key: 'subscribe',
            onClick: () => openModal(ModalName.Subscribe_Notice, record),
            label: t('auditPlan.list.operator.notice'),
          },
        ];
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
              {t('common.edit')}
            </Link>
            <Dropdown trigger={['click']} menu={{ items: menuItems }}>
              <Typography.Link className="pointer">
                {t('common.more')}
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
