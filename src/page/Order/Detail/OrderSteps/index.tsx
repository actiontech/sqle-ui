import { ClockCircleOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
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
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  WorkflowRecordResV1StatusEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
} from '../../../../api/common.enum';
import EmptyBox from '../../../../components/EmptyBox';
import { ModalFormLayout } from '../../../../data/common';
import { IReduxState } from '../../../../store';
import { formatTime } from '../../../../utils/Common';
import { OrderStepsProps, StepStateStatus, StepTypeStatus } from './index.type';

const stepTypeStatus: StepTypeStatus = {
  [WorkflowStepResV1TypeEnum.sql_execute]: {
    label: 'order.operator.sqlExecute',
  },
  [WorkflowStepResV1TypeEnum.sql_review]: {
    label: 'order.operator.sqlReview',
  },
  [WorkflowStepResV1TypeEnum.create_workflow]: {
    label: 'order.operator.unknown',
  },
  [WorkflowStepResV1TypeEnum.update_workflow]: {
    label: 'order.operator.unknown',
  },
  unknown: {
    label: 'order.operator.unknown',
  },
};

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

  return (
    <>
      <Timeline>
        {props.stepList.map((step) => {
          let operator: JSX.Element | string = (
            <Space>
              <Button
                type="primary"
                onClick={pass.bind(null, step.workflow_step_id ?? 0)}
                loading={passLoading}
              >
                {t(stepTypeStatus[step.type ?? 'unknown'].label)}
              </Button>
              <Button
                onClick={handleClickRejectButton.bind(
                  null,
                  step.workflow_step_id ?? 0
                )}
                danger
                loading={rejectLoading}
              >
                {t('order.operator.reject')}
              </Button>
            </Space>
          );
          const modifySqlNode = (
            <EmptyBox
              if={
                props.currentOrderStatus ===
                WorkflowRecordResV1StatusEnum.rejected
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
            !step.assignee_user_name_list?.includes(username)
          ) {
            operator = t('order.operator.wait', {
              username: step.assignee_user_name_list?.join(','),
            });
          } else if (step.type === WorkflowStepResV1TypeEnum.create_workflow) {
            operator = (
              <>
                {t('order.operator.createOrder', {
                  name: step.operation_user_name,
                })}
                {props.readonly ? null : modifySqlNode}
              </>
            );
          } else if (step.type === WorkflowStepResV1TypeEnum.update_workflow) {
            operator = (
              <>
                {t('order.operator.updateOrder', {
                  name: step.operation_user_name,
                })}
                {props.readonly ? null : modifySqlNode}
              </>
            );
          } else if (
            step.state === WorkflowStepResV1StateEnum.approved &&
            step.type === WorkflowStepResV1TypeEnum.sql_review
          ) {
            operator = t('order.operator.approved', {
              username: step.operation_user_name,
            });
          } else if (
            step.state === WorkflowStepResV1StateEnum.approved &&
            step.type === WorkflowStepResV1TypeEnum.sql_execute
          ) {
            operator = t('order.operator.executed', {
              username: step.operation_user_name,
            });
          }
          if (props.currentStep && (step.number ?? 0) > props.currentStep) {
            operator = t('order.operator.notArrival');
          }
          if (props.currentStep === undefined) {
            if (
              props.currentOrderStatus ===
                WorkflowRecordResV1StatusEnum.canceled &&
              step.state === WorkflowStepResV1StateEnum.initialized
            ) {
              operator = t('order.operator.alreadyClosed');
            } else if (step.state === WorkflowStepResV1StateEnum.initialized) {
              operator = t('order.operator.alreadyRejected');
            } else if (step.state === WorkflowStepResV1StateEnum.rejected) {
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
              <Button type="primary" htmlType="submit">
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
