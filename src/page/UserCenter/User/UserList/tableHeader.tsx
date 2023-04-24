import { DownOutlined } from '@ant-design/icons';
import {
  Divider,
  Dropdown,
  MenuProps,
  Popconfirm,
  Space,
  Typography,
} from 'antd';
import { orderBy } from 'lodash';
import { IManagementPermissionResV1, IUserResV1 } from '../../../../api/common';
import EmptyBox from '../../../../components/EmptyBox';
import { LoginTypeEnum } from '../../../../data/common';
import { t } from '../../../../locale';
import { TableColumn } from '../../../../types/common.type';
import generateTag from '../../Common/generateTag';

const tableHeaderFactory = (
  updateUser: (user: IUserResV1) => void,
  removeUser: (username: string) => void,
  updateUserPassword: (user: IUserResV1) => void
): TableColumn<IUserResV1, 'operation'> => {
  return [
    {
      dataIndex: 'user_name',
      title: () => t('user.userForm.username'),
    },
    {
      dataIndex: 'email',
      title: () => t('user.userForm.email'),
    },
    {
      dataIndex: 'phone',
      title: () => t('user.userForm.phone'),
    },
    {
      dataIndex: 'is_disabled',
      title: () => t('user.table.status'),
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
      dataIndex: 'login_type',
      title: () => t('user.table.userType'),
    },
    {
      dataIndex: 'user_group_name_list',
      title: () => t('user.userForm.userGroup'),
      render: (userGroupList?: string[]) => {
        if (!Array.isArray(userGroupList)) {
          return '';
        }
        return generateTag(userGroupList);
      },
    },
    {
      dataIndex: 'management_permission_list',
      title: () => t('user.table.operation'),
      render: (list: IManagementPermissionResV1[]) => {
        if (!Array.isArray(list)) {
          return '';
        }
        return orderBy(list, ['code'], ['asc'])
          .map((e) => e.desc)
          .join(',');
      },
    },
    {
      dataIndex: 'operation',
      title: () => t('common.operate'),
      render: (_, record) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'update-user-password',
            label: t('user.updateUserPassword.button'),
            onClick: () => updateUserPassword(record),
          },
        ];
        return (
          <Space className="user-cell flex-end-horizontal">
            <Typography.Link
              className="pointer"
              onClick={updateUser.bind(null, record)}
            >
              {t('common.edit')}
            </Typography.Link>
            <EmptyBox if={record.user_name !== 'admin'}>
              <Divider type="vertical" />
              <Popconfirm
                title={t('user.deleteUser.confirmTitle', {
                  username: record.user_name,
                })}
                placement="topRight"
                okText={t('common.ok')}
                cancelText={t('common.cancel')}
                onConfirm={removeUser.bind(null, record.user_name ?? '')}
              >
                <Typography.Text type="danger" className="pointer">
                  {t('common.delete')}
                </Typography.Text>
              </Popconfirm>
              <EmptyBox if={record?.login_type !== LoginTypeEnum.ldap}>
                <Divider type="vertical" />
                <Dropdown placement="bottomRight" menu={{ items: menuItems }}>
                  <Typography.Link className="pointer">
                    {t('common.more')}
                    <DownOutlined />
                  </Typography.Link>
                </Dropdown>
              </EmptyBox>
            </EmptyBox>
          </Space>
        );
      },
    },
  ];
};

export default tableHeaderFactory;
