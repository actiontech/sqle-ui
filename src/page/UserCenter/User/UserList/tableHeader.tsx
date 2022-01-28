import { DownOutlined } from '@ant-design/icons';
import {
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from 'antd';
import { IUserResV1 } from '../../../../api/common';
import EmptyBox from '../../../../components/EmptyBox';
import { LoginTypeEnum } from '../../../../data/common';
import i18n from '../../../../locale';
import { TableColumn } from '../../../../types/common.type';

const tableHeaderFactory = (
  updateUser: (user: IUserResV1) => void,
  removeUser: (username: string) => void,
  updateUserPassword: (user: IUserResV1) => void
): TableColumn<IUserResV1, 'operation'> => {
  return [
    {
      dataIndex: 'user_name',
      title: () => i18n.t('user.userForm.username'),
    },
    {
      dataIndex: 'email',
      title: () => i18n.t('user.userForm.email'),
    },
    {
      dataIndex: 'is_disabled',
      title: () => i18n.t('user.table.status'),
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
      dataIndex: 'login_type',
      title: () => i18n.t('user.table.userType'),
    },
    {
      dataIndex: 'role_name_list',
      title: () => i18n.t('user.userForm.role'),
      render: (roleList?: string[]) => {
        return roleList?.map((r) => <Tag key={r}>{r}</Tag>);
      },
    },
    {
      dataIndex: 'user_group_name_list',
      title: () => i18n.t('user.userForm.userGroup'),
      render: (userGroupList?: string[]) => {
        return userGroupList?.join(',');
      },
    },
    {
      dataIndex: 'operation',
      title: () => i18n.t('common.operate'),
      render: (_, record) => {
        return (
          <Space className="user-cell flex-end-horizontal">
            <Typography.Link
              className="pointer"
              onClick={updateUser.bind(null, record)}
            >
              {i18n.t('common.edit')}
            </Typography.Link>
            <EmptyBox if={record.user_name !== 'admin'}>
              <Divider type="vertical" />
              <Popconfirm
                title={i18n.t('user.deleteUser.confirmTitle', {
                  username: record.user_name,
                })}
                placement="topRight"
                okText={i18n.t('common.ok')}
                cancelText={i18n.t('common.cancel')}
                onConfirm={removeUser.bind(null, record.user_name ?? '')}
              >
                <Typography.Text type="danger" className="pointer">
                  {i18n.t('common.delete')}
                </Typography.Text>
              </Popconfirm>
              <EmptyBox if={record?.login_type !== LoginTypeEnum.ldap}>
                <Divider type="vertical" />
                <Dropdown
                  placement="bottomRight"
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={updateUserPassword.bind(null, record)}
                        key="update-user-password"
                      >
                        {i18n.t('user.updateUserPassword.button')}
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Typography.Link className="pointer">
                    {i18n.t('common.more')}
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
