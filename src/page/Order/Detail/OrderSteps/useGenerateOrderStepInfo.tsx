import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IWorkflowStepResV1 } from '../../../../api/common';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV1StateEnum,
  WorkflowStepResV1TypeEnum,
} from '../../../../api/common.enum';
import OrderStatusTag from '../../../../components/OrderStatusTag';
import { IReduxState } from '../../../../store';
import { formatTime } from '../../../../utils/Common';
import { OrderStepsProps, StepStateStatus } from './index.type';

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

const orderTypeIsCreate = (type?: WorkflowStepResV1TypeEnum) => {
  return type === WorkflowStepResV1TypeEnum.create_workflow;
};

const orderTypeIsUpdate = (type?: WorkflowStepResV1TypeEnum) => {
  return type === WorkflowStepResV1TypeEnum.update_workflow;
};

const orderTypeIsReview = (type?: WorkflowStepResV1TypeEnum) => {
  return type === WorkflowStepResV1TypeEnum.sql_review;
};

const orderTypeIsExecute = (type?: WorkflowStepResV1TypeEnum) => {
  return type === WorkflowStepResV1TypeEnum.sql_execute;
};

const orderStateIsApproved = (state?: WorkflowStepResV1StateEnum) => {
  return state === WorkflowStepResV1StateEnum.approved;
};

const orderStateIsInitialized = (state?: WorkflowStepResV1StateEnum) => {
  return state === WorkflowStepResV1StateEnum.initialized;
};

const orderStateIsRejected = (state?: WorkflowStepResV1StateEnum) => {
  return state === WorkflowStepResV1StateEnum.rejected;
};

const isCurrentStep = (stepNumber?: number, currentStep?: number) => {
  return stepNumber === currentStep;
};

export const useGenerateOrderStepInfo = ({
  currentStep,
  readonly,
  currentOrderStatus,
  tasksStatusNumber,
}: Pick<
  OrderStepsProps,
  'currentStep' | 'readonly' | 'currentOrderStatus' | 'tasksStatusNumber'
>) => {
  const { t } = useTranslation();
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );

  const getStepTypeString = (type?: WorkflowStepResV1TypeEnum) => {
    if (orderTypeIsCreate(type)) {
      return t('order.operator.createOrderStep');
    }

    if (orderTypeIsUpdate(type)) {
      return t('order.operator.updateOrderStep');
    }

    if (orderTypeIsReview(type)) {
      return t('order.operator.reviewOrderStep');
    }

    if (orderTypeIsExecute(type)) {
      return t('order.operator.executeOrderStep');
    }

    return 'unknown';
  };

  const getStepActionAndOperateInfo = (
    step: IWorkflowStepResV1,
    modifySqlNode: JSX.Element,
    defaultActionNode: JSX.Element | string | null
  ) => {
    let operateInfo = (
      <>
        <Col span={24}>
          {t('order.operator.time')}：{formatTime(step.operation_time, '--')}
        </Col>
        <Col span={24}>
          {t('order.operator.user')}：{step.operation_user_name ?? '--'}
        </Col>
      </>
    );

    let actionNode = defaultActionNode;
    if (
      isCurrentStep(step.number, currentStep) &&
      !step.assignee_user_name_list?.includes(username)
    ) {
      //步骤时当前的步骤，但是该用户没有权限
      actionNode = t('order.operator.wait', {
        username: step.assignee_user_name_list?.join(','),
      });
    } else if (orderTypeIsCreate(step.type)) {
      //如果不是当前步骤，而是创建工单
      actionNode = readonly ? null : modifySqlNode;
    } else if (orderTypeIsUpdate(step.type)) {
      //如果不是当前步骤，而是更新工单
      actionNode = readonly ? null : modifySqlNode;
    } else if (
      orderTypeIsReview(step.type) &&
      orderStateIsApproved(step.state)
    ) {
      actionNode = null;
    } else if (
      orderTypeIsExecute(step.type) &&
      orderStateIsApproved(step.state)
    ) {
      actionNode = (
        <span>
          {t('order.operator.status')}
          ：
          <OrderStatusTag status={currentOrderStatus} />
        </span>
      );
    }

    if (orderTypeIsExecute(step.type)) {
      operateInfo = (
        <>
          <Col span={24}>
            <Space>
              <span>
                {t('order.status.finished')}：{tasksStatusNumber?.success ?? 0}
              </span>
              <span>
                {t('order.status.exec_failed')}：
                {tasksStatusNumber?.failed ?? 0}
              </span>
              <span>
                {t('order.status.executing')}：
                {tasksStatusNumber?.executing ?? 0}
              </span>
            </Space>
          </Col>
        </>
      );
    }

    if (currentStep && (step.number ?? 0) > currentStep) {
      //当前有步骤且该步骤大于当前步数
      actionNode = t('order.operator.notArrival');
    }

    if (currentStep === undefined) {
      //当前步骤为undefined
      if (
        currentOrderStatus === WorkflowRecordResV2StatusEnum.canceled && //当前工单状态为关闭
        orderStateIsInitialized(step.state) // 步骤状态是初始化
      ) {
        actionNode = t('order.operator.alreadyClosed');
      } else if (orderStateIsInitialized(step.state)) {
        // 步骤状态是初始化
        actionNode = t('order.operator.alreadyRejected');
      } else if (orderStateIsRejected(step.state)) {
        // 步骤状态是驳回
        actionNode = (
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
    return {
      actionNode,
      operateInfo,
    };
  };

  const getTimeLineIcon = (step: IWorkflowStepResV1) => {
    let icon = isCurrentStep(step.number, currentStep) ? (
      <ClockCircleOutlined className="timeline-clock-icon" />
    ) : undefined;

    let color = stepStateStatus[step.state ?? 'unknown'].color;
    if (orderTypeIsCreate(step.type) || orderTypeIsUpdate(step.type)) {
      color = stepStateStatus.approved.color;
    }

    if (
      orderTypeIsExecute(step.type) &&
      currentOrderStatus === WorkflowRecordResV2StatusEnum.executing
    ) {
      icon = <ClockCircleOutlined className="timeline-clock-icon" />;
    }

    return {
      icon,
      color,
    };
  };

  return {
    getStepTypeString,
    getStepActionAndOperateInfo,
    getTimeLineIcon,
  };
};
