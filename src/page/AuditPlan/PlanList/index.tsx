import { SyncOutlined } from '@ant-design/icons';
import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, message, Space, Table } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import audit_plan from '../../../api/audit_plan';
import { IAuditPlanResV2 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import { ModalName } from '../../../data/ModalName';
import useTable from '../../../hooks/useTable';
import { IReduxState } from '../../../store';
import {
  initAuditPlanModalStatus,
  updateAuditPlanModalStatus,
  updateSelectAuditPlan,
} from '../../../store/auditPlan';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import PlanListModal from './Modal';
import PlanListFilterForm from './PlanListFilterForm';
import { PlanListFilterFormFields } from './PlanListFilterForm/index.type';
import { planListTableHeader } from './tableColumn';

const PlanList = () => {
  const { t } = useTranslation();
  const [
    removePending,
    { setTrue: startRemoveAuditPlan, setFalse: removeAuditPlanFinish },
  ] = useBoolean();

  const { projectName } = useCurrentProjectName();

  const projectIsArchive = useSelector(
    (state: IReduxState) => state.projectManage.archived
  );

  const { pagination, tableChange, filterInfo, setFilterInfo } =
    useTable<PlanListFilterFormFields>();

  const [ready, { setTrue: already }] = useBoolean(false);
  const init = useRef(false);

  useEffect(() => {
    if (!init.current) {
      init.current = true;
      return;
    }
    if (!ready) {
      already();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterInfo]);

  const { data, loading, refresh } = useRequest(
    () => {
      return audit_plan
        .getAuditPlansV2({
          project_name: projectName,
          page_index: pagination.pageIndex,
          page_size: pagination.pageSize,
          ...filterInfo,
        })
        .then((res) => {
          return {
            total: res.data?.total_nums ?? 1,
            list: res.data?.data ?? [],
          };
        });
    },
    {
      ready,
      refreshDeps: [pagination, filterInfo],
    }
  );

  const removeAuditPlan = (auditPlanName: string) => {
    if (removePending) {
      return;
    }
    const hide = message.loading(
      t('auditPlan.remove.loading', { name: auditPlanName }),
      0
    );
    startRemoveAuditPlan();
    audit_plan
      .deleteAuditPlanV1({
        audit_plan_name: auditPlanName,
        project_name: projectName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('auditPlan.remove.successTips', { name: auditPlanName })
          );
          refresh();
        }
      })
      .finally(() => {
        hide();
        removeAuditPlanFinish();
      });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initAuditPlanModalStatus({
        modalStatus: {
          [ModalName.Subscribe_Notice]: false,
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (name: ModalName, row?: IAuditPlanResV2) => {
    if (row) {
      dispatch(updateSelectAuditPlan(row));
    }

    dispatch(
      updateAuditPlanModalStatus({
        modalName: name,
        status: true,
      })
    );
  };

  return (
    <Card
      title={
        <Space>
          {t('auditPlan.list.title')}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <EmptyBox if={!projectIsArchive} key="create-audit-plan">
          <Link to={`/project/${projectName}/auditPlan/create`}>
            <Button type="primary">{t('auditPlan.action.create')}</Button>
          </Link>
        </EmptyBox>,
      ]}
    >
      <PlanListFilterForm submit={setFilterInfo} projectName={projectName} />
      <Table
        columns={planListTableHeader(
          removeAuditPlan,
          openModal,
          projectName,
          projectIsArchive
        )}
        dataSource={data?.list ?? []}
        rowKey="audit_plan_name"
        pagination={{
          total: data?.total,
          showSizeChanger: true,
        }}
        loading={loading}
        onChange={tableChange}
      />
      <PlanListModal />
    </Card>
  );
};

export default PlanList;
