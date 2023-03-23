import { DownOutlined } from '@ant-design/icons';
import { Divider, Dropdown, Menu, Popconfirm, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IProjectRuleTemplateResV1 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { RuleUrlParamKey } from '../../Rule/useRuleFilterForm';

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
      title: () => i18n.t('ruleTemplate.ruleTemplateList.table.templateName'),
      render(name: string) {
        if (!name) {
          return '';
        }

        return (
          <Link
            to={`/rule?${RuleUrlParamKey.projectName}=${projectName}&${RuleUrlParamKey.ruleTemplateName}=${name}`}
          >
            {name}
          </Link>
        );
      },
    },
    {
      dataIndex: 'desc',
      ellipsis: true,
      title: () => i18n.t('ruleTemplate.ruleTemplateList.table.desc'),
    },
    {
      dataIndex: 'db_type',
      title: () => i18n.t('ruleTemplate.ruleTemplateList.table.dbType'),
    },
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      width: projectIsArchive ? 80 : 180,
      render: (_, record) => {
        return (
          <>
            <EmptyBox if={!projectIsArchive}>
              <Link
                to={`/project/${projectName}/rule/template/update/${record.rule_template_name}`}
              >
                {i18n.t('common.edit')}
              </Link>
              <Divider type="vertical" />
              <Popconfirm
                title={i18n.t('ruleTemplate.deleteRuleTemplate.tips', {
                  name: record.rule_template_name,
                })}
                placement="topRight"
                onConfirm={deleteTemplate.bind(
                  null,
                  record.rule_template_name ?? ''
                )}
              >
                <Typography.Link type="danger">
                  {i18n.t('common.delete')}
                </Typography.Link>
              </Popconfirm>
              <Divider type="vertical" />
            </EmptyBox>

            <Dropdown
              placement="bottomRight"
              overlay={
                <Menu>
                  <EmptyBox if={!projectIsArchive}>
                    <Menu.Item
                      key="update-user-password"
                      onClick={openCloneRuleTemplateModal.bind(null, record)}
                    >
                      {i18n.t('ruleTemplate.cloneRuleTemplate.button')}
                    </Menu.Item>
                  </EmptyBox>

                  <Menu.Item
                    key="export-rule-template"
                    onClick={exportRuleTemplate.bind(
                      null,
                      record.rule_template_name ?? ''
                    )}
                  >
                    {i18n.t('ruleTemplate.exportRuleTemplate.button')}
                  </Menu.Item>
                </Menu>
              }
            >
              <Typography.Link className="pointer">
                {i18n.t('common.more')}
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
