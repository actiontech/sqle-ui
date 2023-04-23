import { SyncOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/styles';
import { useRequest } from 'ahooks';
import { Button, Card, message, Space, Table } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IGetMemberGroupRespDataV1 } from '../../../api/common';
import user_group from '../../../api/user_group';
import { IGetMemberGroupsV1Params } from '../../../api/user_group/index.d';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useTable from '../../../hooks/useTable';
import { IReduxState } from '../../../store';
import {
  updateMemberModalStatus,
  updateSelectMemberGroup,
} from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import MemberGroupListTableColumnFactory from './column';
import MemberGroupListFilterForm from './FilterForm';
import { MemberGroupListFilterFormFields } from './index.type';
import { Theme } from '@mui/material/styles';

const UserGroupList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projectName } = useCurrentProjectName();
  const projectIsArchive = useSelector(
    (state: IReduxState) => state.projectManage.archived
  );
  const theme = useTheme<Theme>();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const { pagination, tableChange, filterInfo, setFilterInfo } =
    useTable<MemberGroupListFilterFormFields>();

  const createAction = () => {
    if (!actionPermission) {
      return;
    }
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.Add_Member_Group,
        status: true,
      })
    );
  };

  const updateAction = (record: IGetMemberGroupRespDataV1) => {
    if (!actionPermission) {
      return;
    }
    dispatch(updateSelectMemberGroup({ memberGroup: record }));
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.Update_Member_Group,
        status: true,
      })
    );
  };
  const deleteAction = async (userGroupName: string) => {
    if (!actionPermission) {
      return;
    }
    const res = await user_group.deleteMemberGroupV1({
      user_group_name: userGroupName,
      project_name: projectName,
    });

    if (res.data.code === ResponseCode.SUCCESS) {
      message.success(
        t('member.memberGroupList.deleteSuccessTips', {
          name: userGroupName,
        })
      );
      refresh();
    }
  };

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IGetMemberGroupsV1Params = {
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
        filter_instance_name: filterInfo.filterInstance,
        project_name: projectName,
        filter_user_group_name: filterInfo.filterUserGroupName,
      };
      return user_group.getMemberGroupsV1(params).then((res) => {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      });
    },
    {
      refreshDeps: [pagination, filterInfo],
    }
  );

  useEffect(() => {
    EventEmitter.subscribe(EmitterKey.Refresh_Member_Group_List, refresh);

    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_Member_Group_List, refresh);
    };
  }, [refresh]);

  return (
    <Card
      style={{ marginTop: theme.common.padding }}
      title={
        <Space>
          {t('member.memberGroupList.title')}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <EmptyBox
          if={actionPermission && !projectIsArchive}
          key="create-user-group"
        >
          <Button type="primary" onClick={createAction}>
            {t('member.memberGroupList.createAction')}
          </Button>
        </EmptyBox>,
      ]}
    >
      <MemberGroupListFilterForm submit={setFilterInfo} />
      <Table
        rowKey="user_group_name"
        loading={loading}
        dataSource={data?.list}
        columns={MemberGroupListTableColumnFactory(
          updateAction,
          deleteAction,
          actionPermission,
          projectIsArchive
        )}
        pagination={{
          total: data?.total,
          showSizeChanger: true,
        }}
        onChange={tableChange}
      />
    </Card>
  );
};

export default UserGroupList;
