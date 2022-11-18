import { DownOutlined } from '@ant-design/icons';
import { Divider, Dropdown, Menu, Popconfirm, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IProjectRuleTemplateResV1 } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';

export const RuleTemplateListTableColumnFactory = (
  deleteTemplate: (name: string) => void,
  openCloneRuleTemplateModal: (rowData: IProjectRuleTemplateResV1) => void,
  actionPermission: boolean,
  projectName: string
): TableColumn<IProjectRuleTemplateResV1, 'operator'> => {
  const columns: TableColumn<IProjectRuleTemplateResV1, 'operator'> = [
    {
      dataIndex: 'rule_template_name',
      title: () => i18n.t('ruleTemplate.ruleTemplateList.table.templateName'),
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
      dataIndex: 'instance_list',
      title: () => i18n.t('ruleTemplate.ruleTemplateList.table.dataSource'),
      render: (data: IProjectRuleTemplateResV1['instance_list']) => {
        if (!data || !Array.isArray(data)) {
          return '';
        }
        return data.map((item) => <Tag key={item.name}>{item.name ?? ''}</Tag>);
      },
    },
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      width: 180,
      render: (_, record) => {
        return (
          <>
            <Link
              to={`/project/${projectName}/rule/template/update/${record.rule_template_name}`}
            >
              <Typography.Link>{i18n.t('common.edit')}</Typography.Link>
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
            <Dropdown
              placement="bottomRight"
              overlay={
                <Menu>
                  <Menu.Item
                    key="update-user-password"
                    onClick={openCloneRuleTemplateModal.bind(null, record)}
                  >
                    {i18n.t('ruleTemplate.cloneRuleTemplate.button')}
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
