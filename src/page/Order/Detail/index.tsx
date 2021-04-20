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
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { ResponseCode } from '../../../data/common';
import { Theme } from '../../../types/theme.type';
import { formatTime } from '../../../utils/Common';
import AuditResult from './AuditResult';
import ModifySqlModal from './Modal/ModifySqlModal';
import OrderSteps from './OrderSteps';
import useModifySql from './useModifySql';

const Order = () => {
  const urlParams = useParams<{ orderId: string }>();
  const theme = useTheme<Theme>();
  const { t } = useTranslation();

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

  const pass = React.useCallback(async () => {
    return workflow
      .approveWorkflowV1({
        workflow_id: `${orderInfo?.workflow_id}`,
        workflow_step_id: `${orderInfo?.record?.current_step_number}`,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('order.operator.approveSuccessTips'));
          refreshOrder();
        }
      });
  }, [
    orderInfo?.record?.current_step_number,
    orderInfo?.workflow_id,
    refreshOrder,
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
          }
        });
    },
    [orderInfo?.workflow_id, refreshOrder, t]
  );

  const {
    visible,
    tempTaskId,
    tempPassRate,
    openModifySqlModal,
    closeModifySqlModal,
    modifySqlSubmit,
    resetAllState,
  } = useModifySql();

  const [
    updateLoading,
    { setTrue: startUpdateSQL, setFalse: updateSqlFinish },
  ] = useBoolean();

  const updateOrderSql = React.useCallback(() => {
    startUpdateSQL();
    workflow
      .updateWorkflowV1({
        task_id: `${tempTaskId}`,
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
  }, [
    orderInfo?.workflow_id,
    refreshOrder,
    resetAllState,
    startUpdateSQL,
    tempTaskId,
    updateSqlFinish,
  ]);

  const giveUpModify = () => {
    resetAllState();
  };

  return (
    <>
      <PageHeader
        title={
          <Space>
            {t('order.pageTitle')}
            <OrderStatusTag status={orderInfo?.record?.status} />
          </Space>
        }
        ghost={false}
        extra={[<BackButton key="back" />]}
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
          />
          <EmptyBox if={!!orderInfo}>
            <Card title={t('order.operator.title')}>
              <OrderSteps
                stepList={orderInfo?.record?.workflow_step_list ?? []}
                currentStep={orderInfo?.record?.current_step_number}
                currentOrderStatus={orderInfo?.record?.status}
                pass={pass}
                reject={reject}
                modifySql={openModifySqlModal}
              />
            </Card>
          </EmptyBox>
          <EmptyBox if={!!tempTaskId}>
            <Card>
              <Space>
                <Popconfirm
                  title={t('order.modifySql.updateOrderConfirmTips')}
                  onConfirm={updateOrderSql}
                  disabled={updateLoading}
                >
                  <Button type="primary" loading={updateLoading}>
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
          <EmptyBox if={!!tempTaskId}>
            <AuditResult taskId={tempTaskId} passRate={tempPassRate} />
          </EmptyBox>
        </Space>
        <ModifySqlModal
          cancel={closeModifySqlModal}
          submit={modifySqlSubmit}
          visible={visible}
          currentOrderTask={taskInfo}
        />
      </section>
    </>
  );
};

export default Order;
