import { IOperation, IRoleResV1 } from '../../../../api/common';
import { t } from '../../../../locale';
import { TableColumn } from '../../../../types/common.type';
import { orderBy } from 'lodash';
import { Space, Typography, Divider, Popconfirm } from 'antd';

export const RoleListColumnFactory = (
  updateRole: (role: IRoleResV1) => void,
  deleteRole: (roleName: string) => void
): TableColumn<IRoleResV1, 'operator'> => {
  return [
    {
      dataIndex: 'role_name',
      title: () => t('role.roleForm.roleName'),
    },
    {
      dataIndex: 'role_desc',
      title: () => t('role.roleForm.roleDesc'),
      render: (text) => {
        return text;
      },
    },
    {
      dataIndex: 'is_disabled',
      title: () => t('role.roleList.disabled'),
      render: (isDisabled: boolean) => {
        return (
          <Typography.Text type={isDisabled ? 'danger' : undefined}>
            {isDisabled
              ? t('user.userState.disabled')
              : t('user.userState.normal')}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: 'operation_list',
      title: () => t('role.roleList.operation'),
      render: (list: IOperation[]) => {
        if (!Array.isArray(list)) {
          return '';
        }
        orderBy(list, ['operation_code'], ['asc']);
        return list.map((e) => e.op_desc).join(',');
      },
    },
    {
      dataIndex: 'operator',
      title: () => t('common.operate'),
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Typography.Link
              className="pointer"
              onClick={updateRole.bind(null, record)}
            >
              {t('common.edit')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={t('role.deleteRole.deleteTips', {
                name: record.role_name,
              })}
              placement="topRight"
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
              onConfirm={deleteRole.bind(null, record.role_name ?? '')}
            >
              <Typography.Text type="danger" className="pointer">
                {t('common.delete')}
              </Typography.Text>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};
