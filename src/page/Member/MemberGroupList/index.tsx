import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, Space, Table } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { IGetMemberGroupRespDataV1 } from '../../../api/common';
import user_group from '../../../api/user_group';
import { IGetMemberGroupsV1Params } from '../../../api/user_group/index.d';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import useTable from '../../../hooks/useTable';
import {
  updateMemberModalStatus,
  updateSelectMemberGroup,
} from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { ProjectDetailLocationStateType } from '../../ProjectManage/ProjectDetail';
import MemberGroupListTableColumnFactory from './column';
import MemberGroupListFilterForm from './FilterForm';
import { MemberGroupListFilterFormFields } from './index.type';

const UserGroupList: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation<ProjectDetailLocationStateType>();
  const dispatch = useDispatch();

  const { pagination, tableChange, filterInfo, setFilterInfo } =
    useTable<MemberGroupListFilterFormFields>();

  const createAction = () => {
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.Add_Member_Group,
        status: true,
      })
    );
  };

  const updateAction = (record: IGetMemberGroupRespDataV1) => {
    dispatch(updateSelectMemberGroup({ memberGroup: record }));
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.Update_Member_Group,
        status: true,
      })
    );
  };
  const deleteAction = async (userGroupName: string) => {
    const res = await user_group.deleteMemberGroupV1({
      user_group_name: userGroupName,
      project_name: location.state.projectName,
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
    ({ current, pageSize }) => {
      const params: IGetMemberGroupsV1Params = {
        page_index: current,
        page_size: pageSize,
        filter_instance_name: filterInfo.filterInstance,
        project_name: location.state.projectName,
        filter_user_group_name: filterInfo.filterUserGroupName,
      };
      return user_group.getMemberGroupsV1(params);
    },
    {
      paginated: true,
      refreshDeps: [pagination, filterInfo],
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      },
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
      title={
        <Space>
          {t('member.memberGroupList.title')}
          <Button>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <Button key="create-user" type="primary" onClick={createAction}>
          {t('member.memberGroupList.createAction')}
        </Button>,
      ]}
    >
      <MemberGroupListFilterForm submit={setFilterInfo} />
      <Table
        rowKey="user_group_name"
        loading={loading}
        dataSource={data?.list}
        columns={MemberGroupListTableColumnFactory(updateAction, deleteAction)}
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
