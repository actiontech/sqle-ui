import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  message,
  Card,
  Button,
  List,
  Typography,
  Tag,
  Space,
  Divider,
  Popconfirm,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { IUserResV1 } from '../../../api/common';
import user from '../../../api/user';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import {
  updateSelectUser,
  updateUserManageModalStatus,
} from '../../../store/userManage';
import EventEmitter from '../../../utils/EventEmitter';
import { UserListFilter } from './index.type';
import UserListFilterForm from './UserListFilterForm';

const UserList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [userListFilter, setUserListFilter] = React.useState<UserListFilter>(
    {}
  );

  const {
    data,
    loading,
    refresh: refreshUserList,
    pagination: { total, onChange: changePagination, changeCurrent },
  } = useRequest(
    ({ current, pageSize }) => {
      return user.getUserListV1({
        page_index: current,
        page_size: pageSize,
        ...userListFilter,
      });
    },
    {
      paginated: true,
      refreshDeps: [userListFilter],
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      },
    }
  );

  const pageChange = React.useCallback(
    (current: number, pageSize?: number) => {
      if (pageSize) {
        changePagination(current, pageSize);
      } else {
        changeCurrent(current);
      }
    },
    [changeCurrent, changePagination]
  );

  const addUser = React.useCallback(() => {
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Add_User,
        status: true,
      })
    );
  }, [dispatch]);

  const updateUser = React.useCallback(
    (user: IUserResV1) => {
      dispatch(
        updateSelectUser({
          user,
        })
      );
      dispatch(
        updateUserManageModalStatus({
          modalName: ModalName.Update_User,
          status: true,
        })
      );
    },
    [dispatch]
  );

  const removeUser = React.useCallback(
    (username: string) => {
      const hideLoading = message.loading(
        t('user.deleteUser.deleting', { username }),
        0
      );
      user
        .deleteUserV1({ user_name: username })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(t('user.deleteUser.deleteSuccess', { username }));
            refreshUserList();
            EventEmitter.emit(EmitterKey.Refresh_Role_list);
          }
        })
        .finally(() => {
          hideLoading();
        });
    },
    [refreshUserList, t]
  );

  React.useEffect(() => {
    const refresh = () => {
      refreshUserList();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_User_list, refresh);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_User_list, refresh);
    };
  }, [refreshUserList]);

  return (
    <Card
      title={
        <Space>
          {t('user.userListTitle')}
          <Button onClick={refreshUserList}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <Button key="create-user" type="primary" onClick={addUser}>
          {t('user.createUser.button')}
        </Button>,
      ]}
    >
      <UserListFilterForm updateUserListFilter={setUserListFilter} />
      <List
        loading={loading}
        dataSource={data?.list}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          total,
          onChange: pageChange,
        }}
        renderItem={(item) => (
          <List.Item className="user-row-wrapper">
            <List.Item.Meta
              title={item.user_name}
              description={item.email || t('user.userList.emailPlaceholder')}
            />
            <div className="user-cell">
              <div>{t('user.userList.role')}</div>
              <EmptyBox
                if={!!item.role_name_list && item.role_name_list.length > 0}
                defaultNode={
                  <Typography.Text disabled>
                    {t('user.userList.rolePlaceHolder')}
                  </Typography.Text>
                }
              >
                {item.role_name_list?.map((role) => (
                  <Tag key={role}>{role}</Tag>
                ))}
              </EmptyBox>
            </div>
            <Space className="user-cell flex-end-horizontal">
              <Typography.Link
                className="pointer"
                onClick={updateUser.bind(null, item)}
              >
                {t('common.edit')}
              </Typography.Link>
              <Divider type="vertical" />
              <Popconfirm
                title={t('user.deleteUser.confirmTitle', {
                  username: item.user_name,
                })}
                placement="topRight"
                okText={t('common.ok')}
                cancelText={t('common.cancel')}
                onConfirm={removeUser.bind(null, item.user_name ?? '')}
              >
                <Typography.Text type="danger" className="pointer">
                  {t('common.delete')}
                </Typography.Text>
              </Popconfirm>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default UserList;
