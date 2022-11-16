import { Divider, Popconfirm, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IProjectListItem } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';

export const ProjectListTableColumnFactory = (
  deleteAction: (name?: string) => void,
  openModalAndUpdateSelectProject: (record: IProjectListItem) => void
): TableColumn<IProjectListItem, 'operator'> => {
  return [
    {
      dataIndex: 'name',
      title: () => i18n.t('projectManage.projectList.column.name'),
      render(name: string) {
        return <Link to={`/project/${name}`}>{name}</Link>;
      },
    },
    {
      dataIndex: 'desc',
      ellipsis: true,
      title: () => i18n.t('projectManage.projectList.column.desc'),
    },
    {
      dataIndex: 'create_time',
      ellipsis: true,
      title: () => i18n.t('projectManage.projectList.column.createTime'),
    },
    {
      dataIndex: 'create_user_name',
      ellipsis: true,
      title: () => i18n.t('projectManage.projectList.column.createUser'),
    },
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      width: 160,
      render: (_, record) => {
        return (
          <Space>
            <Typography.Link
              className="pointer"
              onClick={() => openModalAndUpdateSelectProject(record)}
            >
              {i18n.t('common.edit')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={i18n.t('ruleTemplate.deleteRuleTemplate.tips', {
                name: record.name,
              })}
              okText={i18n.t('common.ok')}
              cancelText={i18n.t('common.cancel')}
              placement="topRight"
              onConfirm={() => deleteAction(record.name)}
            >
              <Typography.Text type="danger" className="pointer">
                {i18n.t('common.delete')}
              </Typography.Text>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};
