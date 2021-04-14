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
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  WorkflowStepResV1StateEnum,
  WorkFlowStepTemplateReqV1TypeEnum,
} from '../../../../api/common.enum';
import { ModalFormLayout } from '../../../../data/common';
import { IReduxState } from '../../../../store';
import { formatTime } from '../../../../utils/Common';
import { OrderStepsProps, StepStateStatus, StepTypeStatus } from './index.type';

const stepTypeStatus: StepTypeStatus = {
  [WorkFlowStepTemplateReqV1TypeEnum.sql_execute]: {
    label: 'order.operator.sqlExecute',
  },
  [WorkFlowStepTemplateReqV1TypeEnum.sql_review]: {
    label: 'order.operator',
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

  const [
    rejectModalVisible,
    { setTrue: openRejectModal, setFalse: closeRejectModal },
  ] = useBoolean();

  const [
    passLoading,
    { setTrue: passStart, setFalse: passFinish },
  ] = useBoolean();
  const [
    rejectLoading,
    { setTrue: rejectStart, setFalse: rejectFinish },
  ] = useBoolean();

  const pass = () => {
    passStart();
    props.pass().finally(passFinish);
  };

  const reject = (values: { reason: string }) => {
    rejectStart();
    props.reject(values.reason).finally(() => {
      rejectFinish();
      closeRejectModal();
    });
  };

  const resetAndCloseRejectModal = () => {
    form.resetFields();
    closeRejectModal();
  };

  return (
    <>
      <Timeline>
        <Timeline.Item>
          <Row>
            <Col span={5}>
              <Col span={24}>
                {t('order.operator.time')}:{formatTime(props.createTime, '--')}
              </Col>
              <Col span={24}>
                {t('order.operator.user')}:{props.createUser}
              </Col>
            </Col>
            <Col span={19}>
              {t('order.operator.createOrder', {
                name: props.createUser,
              })}
            </Col>
          </Row>
        </Timeline.Item>
        {props.stepList.map((step) => {
          let operator: JSX.Element | string = (
            <Space>
              <Button type="primary" onClick={pass} loading={passLoading}>
                {t(
                  stepTypeStatus[
                    (step.type as WorkFlowStepTemplateReqV1TypeEnum) ??
                      'unknown'
                  ].label
                )}
              </Button>
              <Button onClick={openRejectModal} danger loading={rejectLoading}>
                {t('order.operator.reject')}
              </Button>
            </Space>
          );
          if (!step.assignee_user_name_list?.includes(username)) {
            operator = t('order.operator.wait', {
              username: step.assignee_user_name_list?.join(','),
            });
          }
          if (
            props.currentStep === undefined &&
            step.state === WorkflowStepResV1StateEnum.rejected
          ) {
            operator = (
              <>
                <div>
                  <Typography.Text>
                    {t('order.operator.rejectDetail', {
                      name: step.operation_user_name,
                    })}
                  </Typography.Text>
                </div>
                <Typography.Text type="danger">{step.reason}</Typography.Text>
              </>
            );
          }

          const icon =
            props.currentStep === step.number ? (
              <ClockCircleOutlined className="timeline-clock-icon" />
            ) : undefined;
          return (
            <Timeline.Item
              key={step.operation_time}
              dot={icon}
              color={stepStateStatus[step.state ?? 'unknown'].color}
            >
              <Row>
                <Col span={5}>
                  <Col span={24}>
                    {t('order.operator.time')}:
                    {formatTime(step.operation_time, '--')}
                  </Col>
                  <Col span={24}>
                    {t('order.operator.user')}:{step.operation_user_name}
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
