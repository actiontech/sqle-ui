import { Divider, Popconfirm, Space, Tooltip, Typography } from 'antd';
import {
  IBindRoleReqV1,
  IGetMemberGroupRespDataV1,
  IMemberGroupUserItem,
} from '../../../api/common';
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import renderRolesInfo from '../Common/renderRolesInfo';

const MemberGroupListTableColumnFactory: (
  updateAction: (record: IGetMemberGroupRespDataV1) => void,
  deleteAction: (username: string) => void,
  actionPermission: boolean,
  projectIsArchive: boolean
) => TableColumn<IGetMemberGroupRespDataV1, 'operator'> = (
  updateAction,
  deleteAction,
  actionPermission,
  projectIsArchive
) => {
  const columns: TableColumn<IGetMemberGroupRespDataV1, 'operator'> = [
    {
      dataIndex: 'user_group_name',
      title: t('member.memberGroupList.tableColumn.userGroupName'),
    },
    {
      dataIndex: 'users',
      title: t('member.memberGroupList.tableColumn.users'),
      render(users: IMemberGroupUserItem[]) {
        if (!Array.isArray(users)) {
          return null;
        }
        return (
          <Typography.Text ellipsis={true}>
            {users.map((v) => v.name).join('、')}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: 'roles',
      title: t('member.memberGroupList.tableColumn.role'),
      render(roles?: IBindRoleReqV1[]) {
        if (!Array.isArray(roles) || roles.length === 0) {
          return null;
        }

        return (
          <Tooltip title={renderRolesInfo(roles, false)}>
            {renderRolesInfo(roles, true)}
          </Tooltip>
        );
      },
    },
    {
      dataIndex: 'operator',
      title: t('common.operate'),
      width: 160,
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Typography.Link
              className="pointer"
              onClick={updateAction.bind(null, record)}
            >
              {t('common.edit')}
            </Typography.Link>
            {/* <EmptyBox if={record.user_name !== 'admin'}> */}
            <Divider type="vertical" />
            <Popconfirm
              title={t('member.memberGroupList.tableColumn.confirmTitle', {
                username: record.user_group_name,
              })}
              placement="topRight"
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
              onConfirm={deleteAction.bind(null, record.user_group_name ?? '')}
            >
              <Typography.Text type="danger" className="pointer">
                {t('common.delete')}
              </Typography.Text>
            </Popconfirm>
            {/* </EmptyBox> */}
          </Space>
        );
      },
    },
  ];
  if (!actionPermission || projectIsArchive) {
    return columns.filter((v) => v.dataIndex !== 'operator');
  }
  return columns;
};

export default MemberGroupListTableColumnFactory;
