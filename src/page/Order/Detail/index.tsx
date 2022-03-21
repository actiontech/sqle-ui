import { useTheme } from '@material-ui/styles';
import { useBoolean, useRequest } from 'ahooks';
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
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { WorkflowRecordResV1StatusEnum } from '../../../api/common.enum';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { ResponseCode } from '../../../data/common';
import { Theme } from '../../../types/theme.type';
import { formatTime } from '../../../utils/Common';
import AuditResult from '../AuditResult';
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

  const { data: orderInfo, refresh: refreshOrder } = useRequest(
    () =>
      workflow.getWorkflowV1({
        workflow_id: Number.parseInt(urlParams.orderId),
      }),
    {
      formatResult(res) {
        return res.data.data;
      },
    }
  );

  const { data: taskInfo, refresh: refreshTask } = useRequest(
    () => task.getAuditTaskV1({ task_id: `${orderInfo?.record?.task_id}` }),
    {
      ready: !!orderInfo,
      refreshDeps: [orderInfo?.record?.task_id],
      formatResult(res) {
        return res.data.data;
      },
    }
  );
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
          }
        });
    },
    [orderInfo?.workflow_id, refreshOrder, t]
  );

  const executing = React.useCallback(async () => {
    return workflow
      .executeTaskOnWorkflowV1({
        workflow_id: `${orderInfo?.workflow_id}`,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('order.operator.executingTips'));
          refreshOrder();
          refreshTask();
        }
      });
  }, [orderInfo?.workflow_id, refreshOrder, refreshTask, t]);

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
          }
        });
    },
    [orderInfo?.workflow_id, refreshOrder, t]
  );

  const {
    taskInfo: tempTaskInfo,
    visible,
    openModifySqlModal,
    closeModifySqlModal,
    modifySqlSubmit,
    resetAllState,
    updateOrderDisabled,
    disabledOperatorOrderBtnTips,
  } = useModifySql();

  const [
    updateLoading,
    { setTrue: startUpdateSQL, setFalse: updateSqlFinish },
  ] = useBoolean();

  const [updateTaskRecordTotalNum, setUpdateTaskRecordTotalNum] =
    React.useState(0);
  const updateOrderSql = () => {
    if (updateTaskRecordTotalNum === 0) {
      message.error(t('order.modifySql.updateEmptyOrderTips'));
      return;
    }
    startUpdateSQL();
    workflow
      .updateWorkflowV1({
        task_id: `${tempTaskInfo?.task_id}`,
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

  const execSchedule = React.useCallback(
    async (schedule_time: string | undefined) => {
      return workflow
        .updateWorkflowScheduleV1({
          schedule_time,
          workflow_id: `${orderInfo?.workflow_id}`,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(t('order.operator.execScheduleTips'));
            refreshOrder();
          }
        });
    },
    [orderInfo?.workflow_id, refreshOrder, t]
  );

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
                  orderInfo?.record?.status ===
                    WorkflowRecordResV1StatusEnum.canceled ||
                  orderInfo?.record?.status ===
                    WorkflowRecordResV1StatusEnum.finished ||
                  orderInfo?.record?.status ===
                    WorkflowRecordResV1StatusEnum.exec_failed
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
          <Descriptions.Item label={t('order.order.createTime')}>
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
          <AuditResult
            taskId={orderInfo?.record?.task_id}
            passRate={taskInfo?.pass_rate}
            auditScore={taskInfo?.score}
          />
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
                scheduleTime={orderInfo?.record?.schedule_time}
                scheduledUser={orderInfo?.record?.schedule_user}
                execStartTime={taskInfo?.exec_start_time}
                execEndTime={taskInfo?.exec_end_time}
                maintenanceTime={orderInfo?.instance_maintenance_times}
                pass={pass}
                executing={executing}
                reject={reject}
                execSchedule={execSchedule}
                modifySql={openModifySqlModal}
              />
            </Card>
          </EmptyBox>
          <EmptyBox if={!!tempTaskInfo}>
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
          <EmptyBox if={!!tempTaskInfo?.task_id}>
            <AuditResult
              taskId={tempTaskInfo?.task_id}
              passRate={tempTaskInfo?.pass_rate}
              auditScore={tempTaskInfo?.score}
              updateTaskRecordTotalNum={setUpdateTaskRecordTotalNum}
            />
          </EmptyBox>
        </Space>
        <ModifySqlModal
          cancel={closeModifySqlModal}
          submit={modifySqlSubmit}
          visible={visible}
          currentOrderTask={taskInfo}
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
