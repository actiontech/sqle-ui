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
import { t } from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import renderRolesInfo from '../Common/renderRolesInfo';

const MemberListTableColumnFactory: (
  updateAction: (record: IGetMemberRespDataV1) => void,
  deleteAction: (username: string) => void,
  actionPermission: boolean,
  projectIsArchive: boolean
) => TableColumn<IGetMemberRespDataV1, 'operator'> = (
  updateAction,
  deleteAction,
  actionPermission,
  projectIsArchive
) => {
  const columns: TableColumn<IGetMemberRespDataV1, 'operator'> = [
    {
      dataIndex: 'user_name',
      title: t('member.memberList.tableColumn.username'),
    },
    {
      dataIndex: 'roles',
      title: t('member.memberList.tableColumn.role'),
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
      title: t('member.memberList.tableColumn.isManager'),
      render(isManager: boolean | unknown) {
        if (typeof isManager !== 'boolean') {
          return t('common.unknownStatus');
        }

        return <Checkbox checked={isManager} disabled={true} />;
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
            <EmptyBox if={record.user_name !== 'admin'}>
              <Divider type="vertical" />
              <Popconfirm
                title={t('member.memberList.tableColumn.confirmTitle', {
                  name: record.user_name,
                })}
                placement="topRight"
                okText={t('common.ok')}
                cancelText={t('common.cancel')}
                onConfirm={deleteAction.bind(null, record.user_name ?? '')}
              >
                <Typography.Text type="danger" className="pointer">
                  {t('common.delete')}
                </Typography.Text>
              </Popconfirm>
            </EmptyBox>
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

export default MemberListTableColumnFactory;
