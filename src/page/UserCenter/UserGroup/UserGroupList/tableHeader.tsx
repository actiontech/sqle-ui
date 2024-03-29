import { Divider, Popconfirm, Space, Typography } from 'antd';
import { IUserGroupListItemResV1 } from '../../../../api/common';
import { t } from '../../../../locale';
import { TableColumn } from '../../../../types/common.type';
import generateTag from '../../Common/generateTag';

export const userGroupTableHeaderFactory = (
  updateUserGroup: (data: IUserGroupListItemResV1) => void,
  deleteUserGroup: (userGroupName: string) => void
): TableColumn<IUserGroupListItemResV1, 'operation'> => {
  return [
    {
      dataIndex: 'user_group_name',
      title: () => t('userGroup.userGroupField.userGroupName'),
    },
    {
      dataIndex: 'user_group_desc',
      title: () => t('userGroup.userGroupField.userGroupDesc'),
    },
    {
      dataIndex: 'is_disabled',
      title: () => t('userGroup.userGroupList.isDisabled'),
      render: (isDisabled) => {
        return (
          <Typography.Text type={isDisabled ? 'danger' : undefined}>
            {isDisabled
              ? t('userGroup.userGroupState.disabled')
              : t('userGroup.userGroupState.normal')}
          </Typography.Text>
        );
      },
    },
    {
      dataIndex: 'user_name_list',
      title: () => t('userGroup.userGroupField.userNameList'),
      render: (userNameList) => {
        if (!Array.isArray(userNameList)) {
          return '';
        }
        return generateTag(userNameList);
      },
    },
    {
      dataIndex: 'operation',
      title: () => t('common.operate'),
      render: (_, record) => {
        return (
          <Space>
            <Typography.Link
              className="pointer"
              onClick={updateUserGroup.bind(null, record)}
            >
              {t('common.edit')}
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title={t('userGroup.deleteUserGroup.confirm', {
                name: record.user_group_name,
              })}
              placement="topRight"
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
              onConfirm={deleteUserGroup.bind(
                null,
                record.user_group_name ?? ''
              )}
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
