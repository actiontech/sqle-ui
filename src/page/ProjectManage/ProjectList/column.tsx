import { Divider, Popconfirm, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IProjectListItem } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';

type ProjectListTableColumnFactoryParam = {
  deleteAction: (projectName: string) => void;
  openModalAndUpdateSelectProject: (record: IProjectListItem) => void;
  allowOperateProject: (projectName: string) => boolean;
  updateRecentlyProject: (projectName: string) => void;
  archiveProject: (projectName: string) => void;
  unarchiveProject: (projectName: string) => void;
};

export const ProjectListTableColumnFactory = ({
  unarchiveProject,
  deleteAction,
  openModalAndUpdateSelectProject,
  allowOperateProject,
  archiveProject,
  updateRecentlyProject,
}: ProjectListTableColumnFactoryParam): TableColumn<
  IProjectListItem,
  'operator'
> => {
  return [
    {
      dataIndex: 'name',
      title: () => i18n.t('projectManage.projectList.column.name'),
      render(name: string) {
        return (
          <Link
            onClick={() => updateRecentlyProject(name)}
            to={`/project/${name}`}
          >
            {name}
          </Link>
        );
      },
    },
    {
      dataIndex: 'desc',
      ellipsis: true,
      title: () => i18n.t('projectManage.projectList.column.desc'),
    },
    /* IFTRUE_isEE */
    {
      dataIndex: 'archived',
      title: () => i18n.t('projectManage.projectList.column.status'),
      render(archived: boolean) {
        if (archived) {
          return i18n.t('projectManage.projectList.column.unavailable');
        }

        return i18n.t('projectManage.projectList.column.available');
      },
    },
    /* FITRUE_isEE */
    {
      dataIndex: 'create_time',
      ellipsis: true,
      title: () => i18n.t('projectManage.projectList.column.createTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'create_user_name',
      ellipsis: true,
      title: () => i18n.t('projectManage.projectList.column.createUser'),
    },
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      width: 190,
      render: (_, record) => {
        return (
          <Space>
            <Typography.Link
              className="pointer"
              onClick={() => openModalAndUpdateSelectProject(record)}
              disabled={
                !allowOperateProject(record.name ?? '') || record.archived
              }
            >
              {i18n.t('common.edit')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={i18n.t(
                'projectManage.projectList.column.deleteProjectTips',
                {
                  name: record.name,
                }
              )}
              okText={i18n.t('common.ok')}
              cancelText={i18n.t('common.cancel')}
              placement="topRight"
              onConfirm={() => deleteAction(record.name ?? '')}
              disabled={!allowOperateProject(record.name ?? '')}
            >
              <Typography.Text
                type="danger"
                className="pointer"
                disabled={!allowOperateProject(record.name ?? '')}
              >
                {i18n.t('common.delete')}
              </Typography.Text>
            </Popconfirm>

            {/* IFTRUE_isEE */}
            <Divider type="vertical" />
            <EmptyBox
              if={record.archived}
              defaultNode={
                <Popconfirm
                  title={i18n.t(
                    'projectManage.projectList.column.archiveProjectTips',
                    {
                      name: record.name,
                    }
                  )}
                  okText={i18n.t('common.ok')}
                  cancelText={i18n.t('common.cancel')}
                  placement="topRight"
                  onConfirm={() => archiveProject(record.name ?? '')}
                  disabled={!allowOperateProject(record.name ?? '')}
                >
                  <Typography.Link
                    className="pointer"
                    disabled={!allowOperateProject(record.name ?? '')}
                  >
                    {i18n.t('projectManage.projectList.column.archive')}
                  </Typography.Link>
                </Popconfirm>
              }
            >
              <Popconfirm
                title={i18n.t(
                  'projectManage.projectList.column.unarchiveProjectTips',
                  {
                    name: record.name,
                  }
                )}
                okText={i18n.t('common.ok')}
                cancelText={i18n.t('common.cancel')}
                placement="topRight"
                onConfirm={() => unarchiveProject(record.name ?? '')}
                disabled={!allowOperateProject(record.name ?? '')}
              >
                <Typography.Link
                  className="pointer"
                  disabled={!allowOperateProject(record.name ?? '')}
                >
                  {i18n.t('projectManage.projectList.column.unarchive')}
                </Typography.Link>
              </Popconfirm>
            </EmptyBox>
            {/* FITRUE_isEE */}
          </Space>
        );
      },
    },
  ];
};
