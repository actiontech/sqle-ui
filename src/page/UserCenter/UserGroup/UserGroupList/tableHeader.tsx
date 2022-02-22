import { Divider, Popconfirm, Space, Typography } from 'antd';
import { IUserGroupListItemResV1 } from '../../../../api/common';
import i18n from '../../../../locale';
import { TableColumn } from '../../../../types/common.type';
import generateTag from '../../Common/generateTag';

export const userGroupTableHeaderFactory = (
  updateUserGroup: (data: IUserGroupListItemResV1) => void,
  deleteUserGroup: (userGroupName: string) => void
): TableColumn<IUserGroupListItemResV1, 'operation'> => {
  return [
    {
      dataIndex: 'user_group_name',
      title: () => i18n.t('userGroup.userGroupField.userGroupName'),
    },
    {
      dataIndex: 'user_group_desc',
      title: () => i18n.t('userGroup.userGroupField.userGroupDesc'),
    },
    {
      dataIndex: 'is_disabled',
      title: () => i18n.t('userGroup.userGroupList.isDisabled'),
      render: (isDisabled) => {
        return (
          <Typography.Text type={isDisabled ? 'danger' : undefined}>
            {isDisabled
              ? i18n.t('userGroup.userGroupState.disabled')
              : i18n.t('userGroup.userGroupState.normal')}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: 'user_name_list',
      title: () => i18n.t('userGroup.userGroupField.userNameList'),
      render: (userNameList) => {
        if (!Array.isArray(userNameList)) {
          return '';
        }
        return generateTag(userNameList);
      },
    },
    {
      dataIndex: 'role_name_list',
      title: () => i18n.t('userGroup.userGroupField.roleNameList'),
      render: (roleNameList) => {
        if (!Array.isArray(roleNameList)) {
          return '';
        }
        return generateTag(roleNameList);
      },
    },
    {
      dataIndex: 'operation',
      title: () => i18n.t('common.operate'),
      render: (_, record) => {
        return (
          <Space>
            <Typography.Link
              className="pointer"
              onClick={updateUserGroup.bind(null, record)}
            >
              {i18n.t('common.edit')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={i18n.t('userGroup.deleteUserGroup.confirm', {
                name: record.user_group_name,
              })}
              placement="topRight"
              okText={i18n.t('common.ok')}
              cancelText={i18n.t('common.cancel')}
              onConfirm={deleteUserGroup.bind(
                null,
                record.user_group_name ?? ''
              )}
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
