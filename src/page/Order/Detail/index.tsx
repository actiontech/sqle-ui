import { useTheme } from '@material-ui/styles';
import { useBoolean, useRequest, useToggle } from 'ahooks';
import {
  Button,
  Card,
  Descriptions,
  message,
  PageHeader,
  Popconfirm,
  Space,
  Typography,
} from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { IAuditTaskResV1 } from '../../../api/common';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ModeEnum,
} from '../../../api/common.enum';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { ResponseCode } from '../../../data/common';
import { Theme } from '../../../types/theme.type';
import { formatTime } from '../../../utils/Common';
import AuditResultCollection from '../AuditResult/AuditResultCollection';
import { MaintenanceTimeInfoType } from '../AuditResult/index.type';
import ModifySqlModal from './Modal/ModifySqlModal';
import OrderHistory from './Modal/OrderHistory';
import OrderSteps from './OrderSteps';
import useModifySql from './useModifySql';

const Order = () => {
  const urlParams = useParams<{ orderId: string }>();
  const theme = useTheme<Theme>();
  const { t } = useTranslation();
  const [historyVisible, { setTrue: showHistory, setFalse: closeHistory }] =
    useBoolean();
  const [refreshFlag, { toggle: refreshTask }] = useToggle(false);
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);
  const [auditResultActiveKey, setAuditResultActiveKey] = useState<string>('');
  const [tempAuditResultActiveKey, setTempAuditResultActiveKey] =
    useState<string>('');
  const [canRejectOrder, setCanRejectOrder] = useState(false);
  const [refreshOverviewFlag, { toggle: refreshOverviewAction }] =
    useToggle(false);
  const [maintenanceTimeInfo, setMaintenanceTimeInfo] =
    useState<MaintenanceTimeInfoType>([]);

  const { data: orderInfo, refresh: refreshOrder } = useRequest(
    () =>
      workflow.getWorkflowV2({
        workflow_id: Number.parseInt(urlParams.orderId),
      }),
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  useEffect(() => {
    const request = (taskId: string) => {
      return task.getAuditTaskV1({ task_id: taskId });
    };
    if (!!orderInfo) {
      Promise.all(
        (orderInfo?.record?.tasks ?? []).map((v) =>
          request(v.task_id?.toString() ?? '')
        )
      ).then((res) => {
        if (res.every((v) => v.data.code === ResponseCode.SUCCESS)) {
          setTaskInfos(res.map((v) => v.data.data!));
        }
      });
    }
  }, [orderInfo, refreshFlag]);

  const pass = React.useCallback(
    async (stepId: number) => {
      return workflow
        .approveWorkflowV1({
          workflow_id: `${orderInfo?.workflow_id}`,
          workflow_step_id: `${stepId}`,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(t('order.operator.approveSuccessTips'));
            refreshOrder();
            refreshOverviewAction();
          }
        });
    },
    [orderInfo?.workflow_id, refreshOrder, t, refreshOverviewAction]
  );

  const executing = React.useCallback(async () => {
    return workflow
      .executeTasksOnWorkflowV2({
        workflow_id: `${orderInfo?.workflow_id}`,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('order.operator.executingTips'));
          refreshOrder();
          refreshTask();
          refreshOverviewAction();
        }
      });
  }, [
    orderInfo?.workflow_id,
    refreshOrder,
    refreshOverviewAction,
    refreshTask,
    t,
  ]);

  const reject = React.useCallback(
    async (reason: string, stepId: number) => {
      return workflow
        .rejectWorkflowV1({
          workflow_id: `${orderInfo?.workflow_id}`,
          workflow_step_id: `${stepId}`,
          reason,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(t('order.operator.rejectSuccessTips'));
            refreshOrder();
            refreshOverviewAction();
          }
        });
    },
    [orderInfo?.workflow_id, refreshOrder, refreshOverviewAction, t]
  );

  const {
    taskInfos: tempTaskInfos,
    visible,
    openModifySqlModal,
    closeModifySqlModal,
    modifySqlSubmit,
    resetAllState,
    updateOrderDisabled,
    disabledOperatorOrderBtnTips,
  } = useModifySql(
    orderInfo?.mode ?? WorkflowResV2ModeEnum.same_sqls,
    setTempAuditResultActiveKey
  );

  const [
    updateLoading,
    { setTrue: startUpdateSQL, setFalse: updateSqlFinish },
  ] = useBoolean();

  const [taskSqlNum, setTaskSqlNum] = useState<Map<string, number>>(new Map());

  const updateTaskRecordTotalNum = (taskId: string, sqlNumber: number) => {
    setTaskSqlNum((v) => {
      const cloneValue = cloneDeep(v);
      cloneValue?.set(taskId, sqlNumber);
      return cloneValue;
    });
  };

  const updateOrderSql = () => {
    if (Array.from(taskSqlNum).some(([_, len]) => len === 0)) {
      message.error(t('order.modifySql.updateEmptyOrderTips'));
      return;
    }
    startUpdateSQL();
    workflow
      .updateWorkflowV2({
        task_ids: tempTaskInfos.map((v) => v.task_id!),
        workflow_id: `${orderInfo?.workflow_id}`,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          resetAllState();
          refreshOrder();
        }
      })
      .finally(() => {
        updateSqlFinish();
      });
  };

  const giveUpModify = () => {
    resetAllState();
  };

  const [
    closeOrderLoading,
    { setTrue: startCloseOrder, setFalse: closeOrderFinish },
  ] = useBoolean();
  const closeOrder = React.useCallback(() => {
    startCloseOrder();
    workflow
      .cancelWorkflowV1({
        workflow_id: `${orderInfo?.workflow_id}`,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refreshOrder();
        }
      })
      .finally(() => {
        closeOrderFinish();
      });
  }, [closeOrderFinish, orderInfo?.workflow_id, refreshOrder, startCloseOrder]);
  return (
    <>
      <PageHeader
        title={
          <Space>
            <Typography.Text ellipsis>
              {orderInfo?.subject ?? t('order.pageTitle')}
            </Typography.Text>
            <OrderStatusTag status={orderInfo?.record?.status} />
          </Space>
        }
        ghost={false}
        extra={[
          <Popconfirm
            key="close-confirm"
            title={t('order.closeOrder.closeConfirm')}
            onConfirm={closeOrder}
            disabled={closeOrderLoading}
          >
            {!!orderInfo && (
              <Button
                key="close-order"
                danger
                loading={closeOrderLoading}
                hidden={
                  !(
                    orderInfo?.record?.status ===
                      WorkflowRecordResV2StatusEnum.wait_for_audit ||
                    orderInfo?.record?.status ===
                      WorkflowRecordResV2StatusEnum.wait_for_execution ||
                    orderInfo?.record?.status ===
                      WorkflowRecordResV2StatusEnum.rejected
                  )
                }
              >
                {t('order.closeOrder.button')}
              </Button>
            )}
          </Popconfirm>,
          <BackButton key="back" />,
        ]}
      >
        <Descriptions>
          <Descriptions.Item label={t('order.order.name')}>
            {orderInfo?.subject ?? '--'}
          </Descriptions.Item>
          <Descriptions.Item label={t('order.order.createUser')}>
            {orderInfo?.create_user_name}
          </Descriptions.Item>
          <Descriptions.Item label={t('order.order.createTime')} span={2}>
            {formatTime(orderInfo?.create_time)}
          </Descriptions.Item>
          <Descriptions.Item label={t('order.order.desc')} span={3}>
            {orderInfo?.desc || '--'}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <section className="padding-content">
        <Space
          className="full-width-element"
          direction="vertical"
          size={theme.common.padding}
        >
          <EmptyBox if={!!orderInfo}>
            <Card
              title={t('order.operator.title')}
              extra={[
                Array.isArray(orderInfo?.record_history_list) && (
                  <Button type="primary" onClick={showHistory} key="history">
                    {t('order.history.showHistory')}
                  </Button>
                ),
              ]}
            >
              <OrderSteps
                stepList={orderInfo?.record?.workflow_step_list ?? []}
                currentStep={orderInfo?.record?.current_step_number}
                currentOrderStatus={orderInfo?.record?.status}
                execStartTime={taskInfos?.[0]?.exec_start_time}
                execEndTime={taskInfos?.[0]?.exec_end_time}
                pass={pass}
                executing={executing}
                reject={reject}
                modifySql={openModifySqlModal}
                canRejectOrder={canRejectOrder}
                maintenanceTimeInfo={maintenanceTimeInfo}
              />
            </Card>
          </EmptyBox>

          <AuditResultCollection
            taskInfos={taskInfos}
            auditResultActiveKey={auditResultActiveKey}
            setAuditResultActiveKey={setAuditResultActiveKey}
            showOverview={true}
            workflowId={orderInfo?.workflow_id?.toString()}
            refreshOrder={refreshOrder}
            refreshOverviewFlag={refreshOverviewFlag}
            orderStatus={orderInfo?.record?.status}
            setCanRejectOrder={setCanRejectOrder}
            setMaintenanceTimeInfo={setMaintenanceTimeInfo}
          />
          <EmptyBox if={!!tempTaskInfos.length}>
            <Card>
              <Space>
                <Popconfirm
                  title={
                    updateOrderDisabled
                      ? disabledOperatorOrderBtnTips
                      : t('order.modifySql.updateOrderConfirmTips')
                  }
                  onConfirm={updateOrderSql}
                  disabled={updateLoading}
                  okButtonProps={{ disabled: updateOrderDisabled }}
                >
                  <Button
                    disabled={updateOrderDisabled}
                    type="primary"
                    loading={updateLoading}
                  >
                    {t('order.modifySql.updateOrder')}
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title={t('order.modifySql.giveUpUpdateConfirmTips')}
                  disabled={updateLoading}
                  onConfirm={giveUpModify}
                >
                  <Button type="primary" danger disabled={updateLoading}>
                    {t('order.modifySql.giveUpUpdate')}
                  </Button>
                </Popconfirm>
              </Space>
            </Card>
          </EmptyBox>
          <EmptyBox if={!!tempTaskInfos.length}>
            <AuditResultCollection
              taskInfos={tempTaskInfos}
              auditResultActiveKey={tempAuditResultActiveKey}
              setAuditResultActiveKey={setTempAuditResultActiveKey}
              updateTaskRecordTotalNum={updateTaskRecordTotalNum}
            />
          </EmptyBox>
        </Space>
        <ModifySqlModal
          cancel={closeModifySqlModal}
          submit={modifySqlSubmit}
          visible={visible}
          currentOrderTasks={taskInfos}
          sqlMode={orderInfo?.mode ?? WorkflowResV2ModeEnum.same_sqls}
        />
        <OrderHistory
          visible={historyVisible}
          history={orderInfo?.record_history_list ?? []}
          close={closeHistory}
        />
      </section>
    </>
  );
};

export default Order;
