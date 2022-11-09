import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, Space, Table } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { IGetMemberRespDataV1 } from '../../../api/common';
import user from '../../../api/user';
import { IGetMembersV1Params } from '../../../api/user/index.d';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import useTable from '../../../hooks/useTable';
import {
  updateMemberModalStatus,
  updateSelectMember,
} from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { ProjectDetailLocationStateType } from '../../ProjectManage/ProjectDetail';
import MemberListTableColumnFactory from './column';
import MemberListFilterForm from './FilterForm';
import { MemberListFilterFormFields } from './index.type';
import { mockList } from './__test__/utils';

const MemberList: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation<ProjectDetailLocationStateType>();
  const dispatch = useDispatch();
  const { pagination, tableChange, filterInfo, setFilterInfo } =
    useTable<MemberListFilterFormFields>();

  const createAction = () => {
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.Add_Member,
        status: true,
      })
    );
  };

  const updateAction = (record: IGetMemberRespDataV1) => {
    dispatch(updateSelectMember({ member: record }));
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.Update_Member,
        status: true,
      })
    );
  };
  const removeAction = async (username: string) => {
    const res = await user.deleteMemberV1({
      user_name: username,
      project_name: location.state.projectName,
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
    ({ current, pageSize }) => {
      const params: IGetMembersV1Params = {
        page_index: current,
        page_size: pageSize,
        filter_user_name: filterInfo.filterUserName,
        filter_instance_name: filterInfo.filterInstance,
        project_name: location.state.projectName,
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
          <Button>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <Button key="create-user" type="primary" onClick={createAction}>
          {t('member.memberList.createAction')}
        </Button>,
      ]}
    >
      <MemberListFilterForm submit={setFilterInfo} />
      <Table
        rowKey="user_name"
        loading={loading}
        dataSource={data?.list ?? mockList}
        columns={MemberListTableColumnFactory(updateAction, removeAction)}
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
