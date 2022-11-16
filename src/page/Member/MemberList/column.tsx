import {
  Checkbox,
  Divider,
  Popconfirm,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { IBindRoleReqV1, IGetMemberRespDataV1 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import renderRolesInfo from '../Common/renderRolesInfo';

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
      dataIndex: 'is_manager',
      title: i18n.t('member.memberList.tableColumn.isManager'),
      render(isManager: boolean | unknown) {
        if (typeof isManager !== 'boolean') {
          return i18n.t('common.unknownStatus');
        }

        return <Checkbox checked={isManager} disabled={true} />;
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
            <EmptyBox if={record.user_name !== 'admin'}>
              <Divider type="vertical" />
              <Popconfirm
                title={i18n.t('member.memberList.tableColumn.confirmTitle', {
                  name: record.user_name,
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
            </EmptyBox>
          </Space>
        );
      },
    },
  ];
};

export default MemberListTableColumnFactory;
