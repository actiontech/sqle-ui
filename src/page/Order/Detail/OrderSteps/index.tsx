import { ClockCircleOutlined } from '@ant-design/icons';
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
  Typography,
  Tag,
  Tooltip,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
} from '../../../../api/common.enum';
import EmptyBox from '../../../../components/EmptyBox';
import { ModalFormLayout } from '../../../../data/common';
import { IReduxState } from '../../../../store';
import { formatTime, timeAddZero } from '../../../../utils/Common';
import { OrderStepsProps, StepStateStatus } from './index.type';
import OrderStatusTag from '../../../../components/OrderStatusTag';

const stepStateStatus: StepStateStatus = {
  [WorkflowStepResV1StateEnum.initialized]: {
    color: 'gray',
  },
  [WorkflowStepResV1StateEnum.approved]: {
    color: 'green',
  },
  [WorkflowStepResV1StateEnum.rejected]: {
    color: 'red',
  },
  unknown: {
    color: 'gray',
  },
};

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
      closeRejectModal();
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

  const checkTimeInMaintenanceTime = (time: moment.Moment) => {
    const hour = time.hour();
    const minute = time.minute();

    const maintenanceTime = props.maintenanceTime ?? [];
    if (maintenanceTime.length === 0) {
      return true;
    }

    return maintenanceTime.every((item) => {
      for (const time of item.maintenanceTime) {
        const startHour = time.maintenance_start_time?.hour ?? 0;
        const startMinute = time.maintenance_start_time?.minute ?? 0;
        const endHour = time.maintenance_stop_time?.hour ?? 0;
        const endMinute = time.maintenance_stop_time?.minute ?? 0;
        if (startHour === endHour && startHour === hour) {
          if (minute >= startMinute && minute <= endMinute) {
            return true;
          }
        }
        if (hour === startHour) {
          if (minute >= startMinute) {
            return true;
          }
        }
        if (hour === endHour) {
          if (minute <= endMinute) {
            return true;
          }
        }
        if (hour > startHour && hour < endHour) {
          return true;
        }
      }
      return false;
    });
  };

  const getOperatorTimeElement = (
    execStartTime?: string,
    execEndTime?: string,
    status?: WorkflowRecordResV2StatusEnum
  ) => {
    return (
      <div>
        {/* <span>
          {t('order.operator.startTime', {
            startTime: formatTime(execStartTime),
          })}
        </span>
        <br />
        <span>
          {t('order.operator.endTime', {
            endTime: formatTime(execEndTime),
          })}
        </span>
        <br /> */}
        <span>
          {t('order.operator.status')}
          ：
          <OrderStatusTag status={status} />
        </span>
      </div>
    );
  };

  return (
    <>
      <Timeline>
        {props.stepList.map((step) => {
          let operator: JSX.Element | string = (
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
                        disabled={!checkTimeInMaintenanceTime(moment())}
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
                  !checkTimeInMaintenanceTime(moment()) &&
                  props.currentOrderStatus ===
                    WorkflowRecordResV2StatusEnum.wait_for_execution &&
                  step.type === WorkflowStepResV1TypeEnum.sql_execute
                }
              >
                <div>
                  {t('order.operator.sqlExecuteDisableTips')}:
                  <EmptyBox
                    if={props.maintenanceTime?.some(
                      (v) => v.maintenanceTime.length > 0
                    )}
                    defaultNode={t('order.operator.emptyMaintenanceTime')}
                  >
                    {props.maintenanceTime?.map((item, i) => (
                      <Space key={i}>
                        <div>
                          {item.instanceName}:
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
                defaultNode={t('order.operator.waitModifySql')}
              >
                <div>
                  <Button type="primary" onClick={props.modifySql}>
                    {t('order.operator.modifySql')}
                  </Button>
                </div>
              </EmptyBox>
            </EmptyBox>
          );
          if (
            props.currentStep === step.number &&
            !step.assignee_user_name_list?.includes(username) //步骤时当前的步骤，但是该用户没有权限
          ) {
            operator = t('order.operator.wait', {
              username: step.assignee_user_name_list?.join(','),
            });
          } else if (step.type === WorkflowStepResV1TypeEnum.create_workflow) {
            //如果不是当前步骤，而是创建工单
            operator = (
              <>
                {t('order.operator.createOrder', {
                  name: step.operation_user_name,
                })}
                {props.readonly ? null : modifySqlNode}
              </>
            );
          } else if (step.type === WorkflowStepResV1TypeEnum.update_workflow) {
            //如果不是当前步骤，而是更新工单
            operator = (
              <>
                {t('order.operator.updateOrder', {
                  name: step.operation_user_name,
                })}
                {props.readonly ? null : modifySqlNode}
              </>
            );
          } else if (
            step.state === WorkflowStepResV1StateEnum.approved && //approved 审批通过状态
            step.type === WorkflowStepResV1TypeEnum.sql_review //sql审核类型
          ) {
            operator = t('order.operator.approved', {
              username: step.operation_user_name,
            });
          } else if (
            step.state === WorkflowStepResV1StateEnum.approved && //approved 审批通过状态
            step.type === WorkflowStepResV1TypeEnum.sql_execute && //sql执行类型
            props.scheduleTime
          ) {
            operator = (
              <div>
                {/* {t('order.operator.scheduleExec', {
                  username: step.operation_user_name,
                  time: formatTime(props.scheduleTime),
                })} */}
                {getOperatorTimeElement(
                  props.execStartTime,
                  props.execEndTime,
                  props.currentOrderStatus
                )}
              </div>
            );
          } else if (
            step.state === WorkflowStepResV1StateEnum.approved && //approved 审批通过状态
            step.type === WorkflowStepResV1TypeEnum.sql_execute && //sql执行类型
            !props.scheduleTime
          ) {
            operator = (
              <div>
                {/* {t('order.operator.executing', {
                  username: step.operation_user_name,
                })} */}
                {getOperatorTimeElement(
                  props.execStartTime,
                  props.execEndTime,
                  props.currentOrderStatus
                )}
              </div>
            );
          }
          if (props.currentStep && (step.number ?? 0) > props.currentStep) {
            //当前有步骤且该步骤大于当前步数
            operator = t('order.operator.notArrival');
          }

          if (props.currentStep === undefined) {
            //当前步骤为undefined
            if (
              props.currentOrderStatus ===
                WorkflowRecordResV2StatusEnum.canceled && //当前工单状态为驳回
              step.state === WorkflowStepResV1StateEnum.initialized // 步骤状态是初始化
            ) {
              operator = t('order.operator.alreadyClosed');
            } else if (step.state === WorkflowStepResV1StateEnum.initialized) {
              // 步骤状态是初始化
              operator = t('order.operator.alreadyRejected');
            } else if (step.state === WorkflowStepResV1StateEnum.rejected) {
              // 步骤状态是驳回
              operator = (
                <>
                  <div>
                    <Typography.Text>
                      {t('order.operator.rejectDetail', {
                        name: step.operation_user_name,
                      })}
                    </Typography.Text>
                  </div>
                  <Typography.Text type="danger">
                    {t('order.operator.rejectReason')}:{step.reason}
                  </Typography.Text>
                  <div>
                    <Typography.Text type="danger">
                      ({t('order.operator.rejectTips')})
                    </Typography.Text>
                  </div>
                </>
              );
            }
          }

          const icon =
            props.currentStep === step.number ? (
              <ClockCircleOutlined className="timeline-clock-icon" />
            ) : undefined;
          let color = stepStateStatus[step.state ?? 'unknown'].color;
          if (
            step.type === WorkflowStepResV1TypeEnum.create_workflow ||
            step.type === WorkflowStepResV1TypeEnum.update_workflow
          ) {
            color = stepStateStatus.approved.color;
          }
          return (
            <Timeline.Item
              key={step.workflow_step_id || step.operation_time}
              dot={icon}
              color={color}
            >
              <Row>
                <Col span={5}>
                  <Col span={24}>
                    {t('order.operator.time')}:
                    {formatTime(step.operation_time, '--')}
                  </Col>
                  <Col span={24}>
                    {t('order.operator.user')}:
                    {step.operation_user_name ?? '--'}
                  </Col>
                </Col>
                <Col span={19}>{operator}</Col>
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
