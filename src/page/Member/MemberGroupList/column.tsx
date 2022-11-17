import { Divider, Popconfirm, Space, Tooltip, Typography } from 'antd';
import { IBindRoleReqV1, IGetMemberGroupRespDataV1 } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import renderRolesInfo from '../Common/renderRolesInfo';

const MemberGroupListTableColumnFactory: (
  updateAction: (record: IGetMemberGroupRespDataV1) => void,
  deleteAction: (username: string) => void,
  actionPermission: boolean
) => TableColumn<IGetMemberGroupRespDataV1, 'operator'> = (
  updateAction,
  deleteAction,
  actionPermission
) => {
  const columns: TableColumn<IGetMemberGroupRespDataV1, 'operator'> = [
    {
      dataIndex: 'user_group_name',
      title: i18n.t('member.memberGroupList.tableColumn.userGroupName'),
    },
    {
      dataIndex: 'roles',
      title: i18n.t('member.memberGroupList.tableColumn.role'),
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
      title: i18n.t('common.operate'),
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Typography.Link
              className="pointer"
              onClick={updateAction.bind(null, record)}
            >
              {i18n.t('common.edit')}
            </Typography.Link>
            {/* <EmptyBox if={record.user_name !== 'admin'}> */}
            <Divider type="vertical" />
            <Popconfirm
              title={i18n.t('member.memberGroupList.tableColumn.confirmTitle', {
                username: record.user_group_name,
              })}
              placement="topRight"
              okText={i18n.t('common.ok')}
              cancelText={i18n.t('common.cancel')}
              onConfirm={deleteAction.bind(null, record.user_group_name ?? '')}
            >
              <Typography.Text type="danger" className="pointer">
                {i18n.t('common.delete')}
              </Typography.Text>
            </Popconfirm>
            {/* </EmptyBox> */}
          </Space>
        );
      },
    },
  ];
  if (!actionPermission) {
    return columns.filter((v) => v.dataIndex !== 'operator');
  }
  return columns;
};

export default MemberGroupListTableColumnFactory;
