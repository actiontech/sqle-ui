import { DownOutlined } from '@ant-design/icons';
import { Divider, Dropdown, MenuProps, Popconfirm, Typography } from 'antd';
import { IProjectRuleTemplateResV1 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { RuleUrlParamKey } from '../../Rule/useRuleFilterForm';
import { Link } from '../../../components/Link';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

export const RuleTemplateListTableColumnFactory = (
  deleteTemplate: (name: string) => void,
  exportRuleTemplate: (templateName: string) => void,
  openCloneRuleTemplateModal: (rowData: IProjectRuleTemplateResV1) => void,
  actionPermission: boolean,
  projectName: string,
  projectIsArchive: boolean
): TableColumn<IProjectRuleTemplateResV1, 'operator' | 'template_source'> => {
  const columns: TableColumn<IProjectRuleTemplateResV1, 'operator'> = [
    {
      dataIndex: 'rule_template_name',
      title: () => t('ruleTemplate.ruleTemplateList.table.templateName'),
      render(name: string) {
        if (!name) {
          return '';
        }

        return (
          <Link
            to={`rule?${RuleUrlParamKey.projectName}=${projectName}&${RuleUrlParamKey.ruleTemplateName}=${name}`}
          >
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
    },
    {
      dataIndex: 'operator',
      title: () => t('common.operate'),
      width: projectIsArchive ? 80 : 180,
      render: (_, record) => {
        const exportRuleItems: ItemType = {
          key: 'export-rule-template',
          onClick: () => exportRuleTemplate(record.rule_template_name ?? ''),
          label: t('ruleTemplate.exportRuleTemplate.button'),
        };
        const menuItems: MenuProps['items'] = projectIsArchive
          ? [exportRuleItems]
          : [
              {
                key: 'clone-rule-template',
                onClick: () => openCloneRuleTemplateModal(record),
                label: t('ruleTemplate.cloneRuleTemplate.button'),
              },
              exportRuleItems,
            ];
        return (
          <>
            <EmptyBox if={!projectIsArchive}>
              <Link
                to={`project/${projectName}/rule/template/update/${record.rule_template_name}`}
              >
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
                <Typography.Link type="danger">
                  {t('common.delete')}
                </Typography.Link>
              </Popconfirm>
              <Divider type="vertical" />
            </EmptyBox>

            <Dropdown placement="bottomRight" menu={{ items: menuItems }}>
              <Typography.Link className="pointer">
                {t('common.more')}
                <DownOutlined />
              </Typography.Link>
            </Dropdown>
          </>
        );
      },
    },
  ];

  if (!actionPermission) {
    return columns.filter((v) => v.dataIndex !== 'operator');
  }

  return columns;
};
