import { SyncOutlined } from '@ant-design/icons';
import { usePagination } from 'ahooks';
import { message, Card, Button, Space, Table } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { IUserResV1 } from '../../../../api/common';
import user from '../../../../api/user';
import { IGetUserListV1Params } from '../../../../api/user/index.d';
import { ResponseCode } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import {
  updateSelectUser,
  updateUserManageModalStatus,
} from '../../../../store/userManage';
import EventEmitter from '../../../../utils/EventEmitter';
import { UserListFilter } from './index.type';
import tableHeaderFactory from './tableHeader';
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
  } = usePagination(
    ({ current, pageSize }) => {
      const params: IGetUserListV1Params = {
        page_index: current,
        page_size: pageSize,
        filter_user_name: userListFilter.filter_user_name,
      };
      return user.getUserListV1(params).then((res) => {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      });
    },
    {
      refreshDeps: [userListFilter],
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

  const updateUserPassword = React.useCallback(
    (user: IUserResV1) => {
      dispatch(
        updateSelectUser({
          user,
        })
      );
      dispatch(
        updateUserManageModalStatus({
          modalName: ModalName.Update_User_Password,
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
            EventEmitter.emit(EmitterKey.Refresh_User_Group_List);
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
      <Table
        rowKey="user_name"
        loading={loading}
        dataSource={data?.list}
        columns={tableHeaderFactory(updateUser, removeUser, updateUserPassword)}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          total,
          onChange: pageChange,
        }}
      />
    </Card>
  );
};

export default UserList;
