import { SyncOutlined } from '@ant-design/icons';
import { usePagination } from 'ahooks';
import { Card, Button, Space, message, Table } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { IRoleResV1 } from '../../../../api/common';
import role from '../../../../api/role';
import { ResponseCode } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import {
  updateSelectRole,
  updateUserManageModalStatus,
} from '../../../../store/userManage';
import EventEmitter from '../../../../utils/EventEmitter';
import { RoleListFilter } from './index.type';
import RoleListFilterForm from './RoleListFilterForm';
import { RoleListColumnFactory } from './tableColumn';

const RoleList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [roleListFilter, setRoleListFilter] = React.useState<RoleListFilter>(
    {}
  );

  const {
    data,
    loading,
    refresh: refreshRoleList,
    pagination: { total, onChange: changePagination, changeCurrent },
  } = usePagination(
    ({ current, pageSize }) =>
      role
        .getRoleListV1({
          page_index: current,
          page_size: pageSize,
          filter_role_name: roleListFilter.filter_role_name,
        })
        .then((res) => {
          return {
            list: res.data?.data ?? [],
            total: res.data?.total_nums ?? 0,
          };
        }),
    {
      // paginated: true,
      refreshDeps: [roleListFilter],
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

  const createRole = () => {
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Add_Role,
        status: true,
      })
    );
  };

  const updateRole = (role: IRoleResV1) => {
    dispatch(updateSelectRole({ role }));
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Update_Role,
        status: true,
      })
    );
  };

  const deleteRole = (roleName: string) => {
    const hideLoading = message.loading(
      t('role.deleteRole.deleting', { name: roleName }),
      0
    );
    role
      .deleteRoleV1({
        role_name: roleName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('role.deleteRole.deleteSuccessTips', { name: roleName })
          );
          EventEmitter.emit(EmitterKey.Refresh_User_list);
          refreshRoleList();
        }
      })
      .finally(() => {
        setTimeout(() => {
          hideLoading();
        }, 300);
      });
  };

  React.useEffect(() => {
    const refresh = () => {
      refreshRoleList();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_Role_list, refresh);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_Role_list, refresh);
    };
  }, [refreshRoleList]);

  return (
    <Card
      title={
        <Space>
          {t('role.roleListTitle')}
          <Button onClick={refreshRoleList}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <Button key="create-user" type="primary" onClick={createRole}>
          {t('role.createRole.button')}
        </Button>,
      ]}
    >
      <RoleListFilterForm updateRoleListFilter={setRoleListFilter} />
      <Table
        rowKey="role_name"
        loading={loading}
        dataSource={data?.list}
        pagination={{
          total,
          defaultPageSize: 10,
          showSizeChanger: true,
          onChange: pageChange,
        }}
        columns={RoleListColumnFactory(updateRole, deleteRole)}
      />
    </Card>
  );
};

export default RoleList;
