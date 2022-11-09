import { Divider, Popconfirm, Space, Tooltip, Typography } from 'antd';
import { IBindRoleReqV1, IGetMemberRespDataV1 } from '../../../api/common';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';

const renderRolesInfo = (roles: IBindRoleReqV1[], ellipsis: boolean) => {
  const genContent = (roleNames?: string[], instanceName?: string) =>
    `${instanceName ?? ''}: [ ${roleNames?.toString() ?? ''} ]`;
  return (
    <Space direction="vertical">
      {roles.map((v) => {
        return ellipsis ? (
          <Typography.Text ellipsis={ellipsis} key={v.instance_name}>
            {genContent(v.role_names, v.instance_name)}
          </Typography.Text>
        ) : (
          <div key={v.instance_name}>
            {genContent(v.role_names, v.instance_name)}
          </div>
        );
      })}
    </Space>
  );
};

const MemberListTableColumnFactory: (
  updateAction: (record: IGetMemberRespDataV1) => void,
  deleteAction: (username: string) => void
) => TableColumn<IGetMemberRespDataV1, 'operator'> = (
  updateAction,
  deleteAction
) => {
  return [
    {
      dataIndex: 'user_name',
      title: i18n.t('member.memberList.tableColumn.username'),
    },
    {
      dataIndex: 'roles',
      title: i18n.t('member.memberList.tableColumn.role'),
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
      dataIndex: 'is_owner',
      title: i18n.t('member.memberList.tableColumn.isOwner'),
      render(isOwner: boolean | unknown) {
        if (typeof isOwner !== 'boolean') {
          return i18n.t('common.unknownStatus');
        }

        return isOwner ? i18n.t('common.true') : i18n.t('common.false');
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
              title={i18n.t('user.deleteUser.confirmTitle', {
                username: record.user_name,
              })}
              placement="topRight"
              okText={i18n.t('common.ok')}
              cancelText={i18n.t('common.cancel')}
              onConfirm={deleteAction.bind(null, record.user_name ?? '')}
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
};

export default MemberListTableColumnFactory;
