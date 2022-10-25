import { useBoolean } from 'ahooks';
import moment from 'moment';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Timeline,
  Tag,
  Tooltip,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV1TypeEnum,
} from '../../../../api/common.enum';
import EmptyBox from '../../../../components/EmptyBox';
import { ModalFormLayout } from '../../../../data/common';
import { IReduxState } from '../../../../store';
import { timeAddZero } from '../../../../utils/Common';
import { OrderStepsProps } from './index.type';
import { checkTimeInWithMaintenanceTime } from './utils';
import { useGenerateOrderStepInfo } from './useGenerateOrderStepInfo';

const OrderSteps: React.FC<OrderStepsProps> = (props) => {
  const { t } = useTranslation();
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const [form] = useForm();
  const [rejectStepId, setRejectStepId] = useState(0);

  const [
    rejectModalVisible,
    { setTrue: openRejectModal, setFalse: closeRejectModal },
  ] = useBoolean();

  const [passLoading, { setTrue: passStart, setFalse: passFinish }] =
    useBoolean();
  const [rejectLoading, { setTrue: rejectStart, setFalse: rejectFinish }] =
    useBoolean();

  const [
    executingLoading,
    { setTrue: executingStart, setFalse: executingFinish },
  ] = useBoolean();

  const { getStepTypeString, getStepActionAndOperateInfo, getTimeLineIcon } =
    useGenerateOrderStepInfo(props);

  const pass = (stepId: number) => {
    passStart();
    props.pass(stepId).finally(passFinish);
  };

  const handleClickRejectButton = (stepId: number) => {
    openRejectModal();
    setRejectStepId(stepId);
  };

  const reject = (values: { reason: string }) => {
    rejectStart();
    props.reject(values.reason, rejectStepId).finally(() => {
      rejectFinish();
      resetAndCloseRejectModal();
      setRejectStepId(0);
    });
  };

  const resetAndCloseRejectModal = () => {
    form.resetFields();
    closeRejectModal();
  };

  const executing = () => {
    executingStart();
    props.executing().finally(() => {
      executingFinish();
    });
  };

  const checkInTimeWithMaintenanceTimeInfo = (time: moment.Moment) => {
    return props.maintenanceTimeInfo?.every((v) =>
      checkTimeInWithMaintenanceTime(time, v.maintenanceTime)
    );
  };
  return (
    <>
      <Timeline>
        {props.stepList.map((step) => {
          const defaultActionNode: JSX.Element | string = (
            <>
              <Space>
                <EmptyBox
                  if={
                    props.currentOrderStatus ===
                      WorkflowRecordResV2StatusEnum.wait_for_audit &&
                    step.type === WorkflowStepResV1TypeEnum.sql_review
                  }
                >
                  <Button
                    type="primary"
                    onClick={pass.bind(null, step.workflow_step_id ?? 0)}
                    loading={passLoading}
                  >
                    {t('order.operator.sqlReview')}
                  </Button>
                </EmptyBox>
                <EmptyBox
                  if={
                    props.currentOrderStatus ===
                      WorkflowRecordResV2StatusEnum.wait_for_execution &&
                    step.type === WorkflowStepResV1TypeEnum.sql_execute
                  }
                >
                  <Space>
                    <Tooltip title={t('order.operator.batchSqlExecuteTips')}>
                      <Button
                        type="primary"
                        onClick={executing}
                        loading={executingLoading}
                        disabled={!checkInTimeWithMaintenanceTimeInfo(moment())}
                      >
                        {t('order.operator.batchSqlExecute')}
                      </Button>
                    </Tooltip>
                  </Space>
                </EmptyBox>
                <EmptyBox if={props.canRejectOrder}>
                  <Button
                    onClick={handleClickRejectButton.bind(
                      null,
                      step.workflow_step_id ?? 0
                    )}
                    danger
                  >
                    {t('order.operator.rejectFull')}
                  </Button>
                </EmptyBox>
              </Space>
              <EmptyBox
                if={
                  !checkInTimeWithMaintenanceTimeInfo(moment()) &&
                  props.currentOrderStatus ===
                    WorkflowRecordResV2StatusEnum.wait_for_execution &&
                  step.type === WorkflowStepResV1TypeEnum.sql_execute
                }
              >
                <div>
                  {t('order.operator.sqlExecuteDisableTips')}
                  {': '}
                  <EmptyBox
                    if={props.maintenanceTimeInfo?.some(
                      (v) => v.maintenanceTime.length > 0
                    )}
                    defaultNode={t('order.operator.emptyMaintenanceTime')}
                  >
                    {props.maintenanceTimeInfo?.map((item, i) => (
                      <Space key={i}>
                        <EmptyBox if={item.maintenanceTime.length > 0}>
                          <div>
                            {item.instanceName}
                            {': '}
                            {item.maintenanceTime.map((time) => (
                              <Tag key={i}>
                                {timeAddZero(
                                  time.maintenance_start_time?.hour ?? 0
                                )}
                                :
                                {timeAddZero(
                                  time.maintenance_start_time?.minute ?? 0
                                )}
                                -
                                {timeAddZero(
                                  time.maintenance_stop_time?.hour ?? 0
                                )}
                                :
                                {timeAddZero(
                                  time.maintenance_stop_time?.minute ?? 0
                                )}
                              </Tag>
                            ))}
                          </div>
                        </EmptyBox>
                      </Space>
                    ))}
                  </EmptyBox>
                </div>
              </EmptyBox>
            </>
          );
          const modifySqlNode = (
            <EmptyBox
              if={
                props.currentOrderStatus ===
                WorkflowRecordResV2StatusEnum.rejected
              }
            >
              <EmptyBox
                if={username === step.operation_user_name}
                defaultNode={t('order.operator.waitModifySql', {
                  username: step.operation_user_name,
                })}
              >
                <div>
                  <Button type="primary" onClick={props.modifySql}>
                    {t('order.operator.modifySql')}
                  </Button>
                </div>
              </EmptyBox>
            </EmptyBox>
          );

          const { actionNode, operateInfo } = getStepActionAndOperateInfo(
            step,
            modifySqlNode,
            defaultActionNode
          );

          const { color, icon } = getTimeLineIcon(step);

          return (
            <Timeline.Item
              key={step.workflow_step_id || step.operation_time}
              dot={icon}
              color={color}
            >
              <Row>
                <Col span={3}>{getStepTypeString(step.type)}</Col>
                <Col span={6}>{actionNode}</Col>
                <Col span={15}>{operateInfo}</Col>
              </Row>
            </Timeline.Item>
          );
        })}
      </Timeline>
      <Modal
        title={t('order.operator.reject')}
        visible={rejectModalVisible}
        closable={false}
        footer={null}
      >
        <Form {...ModalFormLayout} form={form} onFinish={reject}>
          <Form.Item
            label={t('order.operator.rejectReason')}
            name="reason"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea placeholder={t('common.form.placeholder.input')} />
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Space>
              <Button type="primary" htmlType="submit" loading={rejectLoading}>
                {t('order.operator.reject')}
              </Button>
              <Button onClick={resetAndCloseRejectModal}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OrderSteps;
