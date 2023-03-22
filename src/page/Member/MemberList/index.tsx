import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, Space, Table } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IGetMemberRespDataV1 } from '../../../api/common';
import user from '../../../api/user';
import { IGetMembersV1Params } from '../../../api/user/index.d';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useTable from '../../../hooks/useTable';
import { IReduxState } from '../../../store';
import {
  updateMemberModalStatus,
  updateSelectMember,
} from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import MemberListTableColumnFactory from './column';
import MemberListFilterForm from './FilterForm';
import { MemberListFilterFormFields } from './index.type';

const MemberList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projectName } = useCurrentProjectName();
  const { pagination, tableChange, filterInfo, setFilterInfo } =
    useTable<MemberListFilterFormFields>();
  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);
  const projectIsArchive = useSelector(
    (state: IReduxState) => state.projectManage.archived
  );
  const createAction = () => {
    if (!actionPermission) {
      return;
    }
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.Add_Member,
        status: true,
      })
    );
  };

  const updateAction = (record: IGetMemberRespDataV1) => {
    if (!actionPermission) {
      return;
    }
    dispatch(updateSelectMember({ member: record }));
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.Update_Member,
        status: true,
      })
    );
  };
  const deleteAction = async (username: string) => {
    if (!actionPermission) {
      return;
    }
    const res = await user.deleteMemberV1({
      user_name: username,
      project_name: projectName,
    });

    if (res.data.code === ResponseCode.SUCCESS) {
      message.success(
        t('member.memberList.deleteSuccessTips', {
          name: username,
        })
      );
      refresh();
    }
  };

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IGetMembersV1Params = {
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
        filter_user_name: filterInfo.filterUserName,
        filter_instance_name: filterInfo.filterInstance,
        project_name: projectName,
      };
      return user.getMembersV1(params);
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
    EventEmitter.subscribe(EmitterKey.Refresh_Member_List, refresh);

    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_Member_List, refresh);
    };
  }, [refresh]);

  return (
    <Card
      title={
        <Space>
          {t('member.memberList.title')}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <EmptyBox if={actionPermission && !projectIsArchive} key="create-user">
          <Button type="primary" onClick={createAction}>
            {t('member.memberList.createAction')}
          </Button>
        </EmptyBox>,
      ]}
    >
      <MemberListFilterForm submit={setFilterInfo} />
      <Table
        rowKey="user_name"
        loading={loading}
        dataSource={data?.list}
        columns={MemberListTableColumnFactory(
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

export default MemberList;
