import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Timeline, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { WorkflowStepResV1StateEnum } from '../../../api/common.enum';
import { IReduxState } from '../../../store';
import { formatTime } from '../../../utils/Common';
import { OrderStepsProps, StepStateStatus, StepTypeStatus } from './index.type';

const stepTypeStatus: StepTypeStatus = {
  sql_execute: {
    label: 'order.operator.sqlExecute',
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

  return (
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
      {props.stepList.map((step, index) => {
        let operator: JSX.Element | string = (
          <Space>
            <Button type="primary" onClick={props.pass}>
              {t(stepTypeStatus[step.type ?? 'unknown'].label)}
            </Button>
            <Button onClick={props.reject} danger>
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
              <Typography.Text>{step.reason}</Typography.Text>
            </>
          );
        }

        const icon =
          props.currentStep === step.number ? (
            <ClockCircleOutlined className="timeline-clock-icon" />
          ) : undefined;
        return (
          <Timeline.Item
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
  );
};

export default OrderSteps;
