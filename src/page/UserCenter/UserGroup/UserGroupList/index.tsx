import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, Space, Table } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { IUserGroupListItemResV1 } from '../../../../api/common';
import user_group from '../../../../api/user_group';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import useTable from '../../../../hooks/useTable';
import {
  updateSelectUserGroup,
  updateUserManageModalStatus,
} from '../../../../store/userManage';
import EventEmitter from '../../../../utils/EventEmitter';
import { userGroupTableHeaderFactory } from './tableHeader';

const UserGroupList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { pagination, tableChange } = useTable();

  const { data, loading, refresh } = useRequest(
    () => {
      return user_group.getUserGroupListV1({
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
      });
    },
    {
      refreshDeps: [pagination],
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      },
    }
  );

  const addUserGroup = () => {
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Add_User_Group,
        status: true,
      })
    );
  };

  const updateUserGroup = (data: IUserGroupListItemResV1) => {
    dispatch(
      updateSelectUserGroup({
        userGroup: data,
      })
    );
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Update_User_Group,
        status: true,
      })
    );
  };

  const deleteUserGroup = (userGroupName: string) => {};

  useEffect(() => {
    const scopeRefresh = () => {
      refresh();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_User_Group_List, scopeRefresh);
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_User_Group_List,
        scopeRefresh
      );
    };
  }, [refresh]);

  return (
    <Card
      title={
        <Space>
          {t('userGroup.userGroupList.title')}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <Button
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          onClick={addUserGroup}
        >
          {t('userGroup.createUserGroup.title')}
        </Button>,
      ]}
    >
      <Table
        loading={loading}
        dataSource={data?.list}
        columns={userGroupTableHeaderFactory(updateUserGroup, deleteUserGroup)}
        onChange={tableChange}
        pagination={{
          total: data?.total,
          showSizeChanger: true,
        }}
      />
    </Card>
  );
};

export default UserGroupList;
