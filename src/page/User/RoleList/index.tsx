import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Card,
  Button,
  List,
  Typography,
  Space,
  Divider,
  Popconfirm,
  message,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { IRoleResV1 } from '../../../api/common';
import role from '../../../api/role';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import {
  updateSelectRole,
  updateUserManageModalStatus,
} from '../../../store/userManage';
import EventEmitter from '../../../utils/EventEmitter';
import { RoleListFilter } from './index.type';
import RoleListFilterForm from './RoleListFilterForm';

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
  } = useRequest(
    ({ current, pageSize }) =>
      role.getRoleListV1({
        page_index: current,
        page_size: pageSize,
        ...roleListFilter,
      }),
    {
      paginated: true,
      refreshDeps: [roleListFilter],
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
      t('user.deleteRole.deleting', { name: roleName }),
      0
    );
    role
      .deleteRoleV1({
        role_name: roleName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('user.deleteRole.deleteSuccessTips', { name: roleName })
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
          {t('user.roleListTitle')}
          <Button onClick={refreshRoleList}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <Button key="create-user" type="primary" onClick={createRole}>
          {t('user.createRole.button')}
        </Button>,
      ]}
    >
      <RoleListFilterForm updateRoleListFilter={setRoleListFilter} />
      <List
        loading={loading}
        dataSource={data?.list}
        pagination={{
          total,
          defaultPageSize: 10,
          showSizeChanger: true,
          onChange: pageChange,
        }}
        renderItem={(item) => (
          <List.Item className="user-row-wrapper">
            <List.Item.Meta
              title={item.role_name}
              description={
                item.role_desc || t('user.roleList.roleDescPlaceholder')
              }
            />
            <div className="user-cell">
              <div>{t('user.roleList.username')}</div>
              <EmptyBox
                if={!!item.user_name_list && item.user_name_list.length > 0}
                defaultNode={
                  <Typography.Text disabled>
                    {t('user.roleList.usernamePlaceholder')}
                  </Typography.Text>
                }
              >
                {item.user_name_list?.join(',')}
              </EmptyBox>
            </div>
            <div className="user-cell">
              <div>{t('user.roleList.database')}</div>
              <EmptyBox
                if={
                  !!item.instance_name_list &&
                  item.instance_name_list.length > 0
                }
                defaultNode={
                  <Typography.Text disabled>
                    {t('user.roleList.databasePlaceholder')}
                  </Typography.Text>
                }
              >
                {item.instance_name_list?.join(',')}
              </EmptyBox>
            </div>
            <Space className="user-cell flex-end-horizontal">
              <Typography.Link
                className="pointer"
                onClick={updateRole.bind(null, item)}
              >
                {t('common.edit')}
              </Typography.Link>
              <Divider type="vertical" />
              <Popconfirm
                title={t('user.deleteRole.deleteTips', {
                  name: item.role_name,
                })}
                placement="topRight"
                okText={t('common.ok')}
                cancelText={t('common.cancel')}
                onConfirm={deleteRole.bind(null, item.role_name ?? '')}
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

export default RoleList;
