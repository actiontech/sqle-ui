import { IOperation, IRoleResV2 } from '../../../../api/common';
import i18n from '../../../../locale';
import { TableColumn } from '../../../../types/common.type';
import { orderBy } from 'lodash';
import { Space, Typography, Divider, Popconfirm } from 'antd';
import generateTag from '../../Common/generateTag';

export const RoleListColumnFactory = (
  updateRole: (role: IRoleResV2) => void,
  deleteRole: (roleName: string) => void
): TableColumn<IRoleResV2, 'operator'> => {
  return [
    {
      dataIndex: 'role_name',
      title: () => i18n.t('role.roleForm.roleName'),
    },
    {
      dataIndex: 'role_desc',
      title: () => i18n.t('role.roleForm.roleDesc'),
      render: (text) => {
        return text ?? i18n.t('role.roleList.roleDescPlaceholder');
      },
    },
    {
      dataIndex: 'is_disabled',
      title: () => i18n.t('role.roleList.disabled'),
      render: (isDisabled: boolean) => {
        return (
          <Typography.Text type={isDisabled ? 'danger' : undefined}>
            {isDisabled
              ? i18n.t('user.userState.disabled')
              : i18n.t('user.userState.normal')}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: 'operation_list',
      title: () => i18n.t('role.roleList.operation'),
      render: (list: IOperation[]) => {
        if (!Array.isArray(list)) {
          return '';
        }
        return orderBy(list, ['operation_code'], ['asc'])
          .map((e) => e.op_desc)
          .join(',');
      },
    },
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Typography.Link
              className="pointer"
              onClick={updateRole.bind(null, record)}
            >
              {i18n.t('common.edit')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={i18n.t('role.deleteRole.deleteTips', {
                name: record.role_name,
              })}
              placement="topRight"
              okText={i18n.t('common.ok')}
              cancelText={i18n.t('common.cancel')}
              onConfirm={deleteRole.bind(null, record.role_name ?? '')}
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
