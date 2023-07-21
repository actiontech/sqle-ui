import { DownOutlined } from '@ant-design/icons';
import {
  Divider,
  Dropdown,
  MenuProps,
  Popconfirm,
  Space,
  Typography,
} from 'antd';
import { IRuleTemplateResV1 } from '../../../api/common';
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { RuleUrlParamKey } from '../../Rule/useRuleFilterForm';
import { Link } from '../../../components/Link';
import DatabaseTypeLogo from '../../../components/DatabaseTypeLogo';

export const RuleTemplateListTableColumnFactory = (
  deleteTemplate: (name: string) => void,
  exportRuleTemplate: (name: string) => void,
  openCloneRuleTemplateModal: (rowData: IRuleTemplateResV1) => void,
  isAdmin: boolean
): TableColumn<IRuleTemplateResV1, 'operator'> => {
  const columns: TableColumn<IRuleTemplateResV1, 'operator'> = [
    {
      dataIndex: 'rule_template_name',
      title: () => t('ruleTemplate.ruleTemplateList.table.templateName'),
      render(name: string) {
        if (!name) {
          return '';
        }

        return (
          <Link to={`rule?${RuleUrlParamKey.ruleTemplateName}=${name}`}>
            {name}
          </Link>
        );
      },
    },
    {
      dataIndex: 'desc',
      ellipsis: true,
      title: () => t('ruleTemplate.ruleTemplateList.table.desc'),
    },
    {
      dataIndex: 'db_type',
      title: () => t('ruleTemplate.ruleTemplateList.table.dbType'),
      render(type: string) {
        if (!type) {
          return '--';
        }

        return <DatabaseTypeLogo dbType={type} />;
      },
    },
    {
      dataIndex: 'operator',
      title: () => t('common.operate'),
      render: (_, record) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'clone-rule-template',
            onClick: () => openCloneRuleTemplateModal(record),
            label: t('ruleTemplate.cloneRuleTemplate.button'),
          },
          {
            key: 'export-rule-template',
            onClick: () => exportRuleTemplate(record.rule_template_name ?? ''),
            label: t('ruleTemplate.exportRuleTemplate.button'),
          },
        ];
        return (
          <Space className="user-cell flex-end-horizontal">
            <Link to={`rule/template/update/${record.rule_template_name}`}>
              {t('common.edit')}
            </Link>
            <Divider type="vertical" />
            <Popconfirm
              title={t('ruleTemplate.deleteRuleTemplate.tips', {
                name: record.rule_template_name,
              })}
              placement="topRight"
              onConfirm={deleteTemplate.bind(
                null,
                record.rule_template_name ?? ''
              )}
            >
              <Typography.Text type="danger" className="pointer">
                {t('common.delete')}
              </Typography.Text>
            </Popconfirm>
            <Divider type="vertical" />
            <Dropdown placement="bottomRight" menu={{ items: menuItems }}>
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

  if (!isAdmin) {
    return columns.filter((v) => v.dataIndex !== 'operator');
  }

  return columns;
};
