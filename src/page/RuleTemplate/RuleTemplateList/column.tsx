import { DownOutlined } from '@ant-design/icons';
import {
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from 'antd';
import { Link } from 'react-router-dom';
import { IRuleTemplateResV1 } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';

export const RuleTemplateListTableColumnFactory = (
  deleteTemplate: (name: string) => void,
  openCloneRuleTemplateModal: (rowData: IRuleTemplateResV1) => void
): TableColumn<IRuleTemplateResV1, 'operator'> => {
  return [
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
      dataIndex: 'instance_name_list',
      title: () => i18n.t('ruleTemplate.ruleTemplateList.table.dataSource'),
      render: (data: IRuleTemplateResV1['instance_name_list']) => {
        if (!data || !Array.isArray(data)) {
          return '';
        }
        return data.map((item) => <Tag key={item}>{item}</Tag>);
      },
    },
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Link to={`/rule/template/update/${record.rule_template_name}`}>
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
              <Typography.Text type="danger" className="pointer">
                {i18n.t('common.delete')}
              </Typography.Text>
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
          </Space>
        );
      },
    },
  ];
};
