import { useTheme } from '@mui/styles';
import { useBoolean, useToggle } from 'ahooks';
import {
  Button,
  Card,
  Descriptions,
  message,
  PageHeader,
  Popconfirm,
  Space,
  Spin,
  Typography,
} from 'antd';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ModeEnum,
} from '../../../api/common.enum';
import workflow from '../../../api/workflow';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { ResponseCode } from '../../../data/common';
import { formatTime } from '../../../utils/Common';
import AuditResultCollection from '../AuditResult/AuditResultCollection';
import ModifySqlModal from './Modal/ModifySqlModal';
import OrderHistory from './Modal/OrderHistory';
import OrderSteps from './OrderSteps';
import useModifySql from './hooks/useModifySql';
import useInitDataWithRequest from './hooks/useInitDataWithRequest';
import useGenerateOrderStepsProps from './hooks/useGenerateOrderStepsProps';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { Theme } from '@mui/material/styles';

const Order = () => {
  const theme = useTheme<Theme>();
  const { projectName } = useCurrentProjectName();
  const { t } = useTranslation();
  const [historyVisible, { setTrue: showHistory, setFalse: closeHistory }] =
    useBoolean();
  const [auditResultActiveKey, setAuditResultActiveKey] = useState<string>('');
  const [refreshOverviewFlag, { toggle: refreshOverviewAction }] =
    useToggle(false);

  const { taskInfos, orderInfo, refreshOrder, refreshTask, initLoading } =
    useInitDataWithRequest();

  const {
    pass,
    executing,
    reject,
    maintenanceTimeInfo,
    canRejectOrder,
    tasksStatusNumber,
    getOverviewListSuccessHandle,
    complete,
    terminate,
  } = useGenerateOrderStepsProps({
    workflowId: orderInfo?.workflow_id ?? '',
    refreshOrder,
    refreshTask,
    refreshOverviewAction,
    projectName,
  });

  const {
    taskInfos: tempTaskInfos,
    modifySqlModalVisibility,
    openModifySqlModal,
    closeModifySqlModal,
    modifySqlSubmit,
    resetAllState,
    isDisableFinallySubmitButton,
    disabledOperatorOrderBtnTips,
    auditResultActiveKey: tempAuditResultActiveKey,
    setAuditResultActiveKey: setTempAuditResultActiveKey,
  } = useModifySql(orderInfo?.mode ?? WorkflowResV2ModeEnum.same_sqls);

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
        project_name: projectName,
        task_ids: tempTaskInfos.map((v) => v.task_id!),
        workflow_id: `${orderInfo?.workflow_id ?? ''}`,
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
      .cancelWorkflowV2({
        project_name: projectName,
        workflow_id: `${orderInfo?.workflow_id ?? ''}`,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refreshOrder();
          message.success(t('order.closeOrder.closeOrderSuccessTips'));
        }
      })
      .finally(() => {
        closeOrderFinish();
      });
  }, [
    closeOrderFinish,
    orderInfo?.workflow_id,
    projectName,
    refreshOrder,
    startCloseOrder,
    t,
  ]);

  return (
    <Spin spinning={initLoading} delay={400}>
      <PageHeader
        title={
          <Space>
            <Typography.Text ellipsis>
              {orderInfo?.workflow_name ?? t('order.pageTitle')}
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
            okText={t('common.ok')}
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
                complete={complete}
                terminate={terminate}
                reject={reject}
                modifySql={openModifySqlModal}
                canRejectOrder={canRejectOrder}
                maintenanceTimeInfo={maintenanceTimeInfo}
                tasksStatusNumber={tasksStatusNumber}
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
            getOverviewListSuccessHandle={getOverviewListSuccessHandle}
            projectName={projectName}
          />
          <EmptyBox if={!!tempTaskInfos.length}>
            <Card>
              <Space>
                <Popconfirm
                  title={
                    isDisableFinallySubmitButton
                      ? disabledOperatorOrderBtnTips
                      : t('order.modifySql.updateOrderConfirmTips')
                  }
                  onConfirm={updateOrderSql}
                  disabled={updateLoading}
                  okButtonProps={{ disabled: isDisableFinallySubmitButton }}
                >
                  <Button
                    disabled={isDisableFinallySubmitButton}
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
              projectName={projectName}
            />
          </EmptyBox>
        </Space>
        <ModifySqlModal
          cancel={closeModifySqlModal}
          submit={modifySqlSubmit}
          visible={modifySqlModalVisibility}
          currentOrderTasks={taskInfos}
          sqlMode={orderInfo?.mode ?? WorkflowResV2ModeEnum.same_sqls}
        />
        <OrderHistory
          visible={historyVisible}
          history={orderInfo?.record_history_list ?? []}
          close={closeHistory}
        />
      </section>
    </Spin>
  );
};

export default Order;
