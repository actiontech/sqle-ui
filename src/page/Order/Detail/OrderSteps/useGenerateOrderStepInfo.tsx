import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IWorkflowStepResV2 } from '../../../../api/common';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum,
} from '../../../../api/common.enum';
import OrderStatusTag from '../../../../components/OrderStatusTag';
import { IReduxState } from '../../../../store';
import { formatTime } from '../../../../utils/Common';
import { ActionNodeType, OrderStepsProps, StepStateStatus } from './index.type';

const stepStateStatus: StepStateStatus = {
  [WorkflowStepResV2StateEnum.initialized]: {
    color: 'gray',
  },
  [WorkflowStepResV2StateEnum.approved]: {
    color: 'green',
  },
  [WorkflowStepResV2StateEnum.rejected]: {
    color: 'red',
  },
  unknown: {
    color: 'gray',
  },
};

const orderTypeIsCreate = (type?: WorkflowStepResV2TypeEnum) => {
  return type === WorkflowStepResV2TypeEnum.create_workflow;
};

const orderTypeIsUpdate = (type?: WorkflowStepResV2TypeEnum) => {
  return type === WorkflowStepResV2TypeEnum.update_workflow;
};

const orderTypeIsReview = (type?: WorkflowStepResV2TypeEnum) => {
  return type === WorkflowStepResV2TypeEnum.sql_review;
};

const orderTypeIsExecute = (type?: WorkflowStepResV2TypeEnum) => {
  return type === WorkflowStepResV2TypeEnum.sql_execute;
};

const orderStateIsApproved = (state?: WorkflowStepResV2StateEnum) => {
  return state === WorkflowStepResV2StateEnum.approved;
};

const orderStateIsInitialized = (state?: WorkflowStepResV2StateEnum) => {
  return state === WorkflowStepResV2StateEnum.initialized;
};

const orderStateIsRejected = (state?: WorkflowStepResV2StateEnum) => {
  return state === WorkflowStepResV2StateEnum.rejected;
};

const isCurrentStep = (stepNumber?: number, currentStep?: number) => {
  return stepNumber === currentStep;
};

export const useGenerateOrderStepInfo = ({
  currentStep,
  readonly,
  currentOrderStatus,
  tasksStatusNumber,
  canRejectOrder,
}: OrderStepsProps) => {
  const { t } = useTranslation();
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );

  const generateStepTypeString = (type?: WorkflowStepResV2TypeEnum) => {
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

    return t('order.operator.unknown');
  };

  /**
   *  1. 判断工单步骤与当前步骤的关系
   *     1. 工单步骤大于当前步骤, 直接返回 等待上一步执行
   *     2. 工单步骤小与当前步骤, 直接返回 null ?? 等待确认
   *     3. 当前步骤与工单步骤相等时, 继续判断当前用户是否有权限操作,
   *     4. 当前步骤 为 undefined, 继续根据当前工单状态去判断
   *  2. 处理步骤相等的情况
   *    1. 无权限, 直接返回 正在等待用户进行操作 的提示语句.
   *    2. 有权限, 根据当前步骤的类型以及状态继续判断
   *  3. 根据当前步骤的类型以及状态判断
   *    1. 当前步骤为 创建工单 或者 修改工单, 生成对应的 Node. 逻辑为若当前工单状态为 rejected 并且当前用户为当前步骤的操作用户 时, 生成修改审核语句按钮.
   *    2. 当前步骤为 审核工单时
   *       1. 通过工单步骤状态判断当前是否已经审核, 若已审核, 返回 null, 若未审核, 走 2
   *       2. 当前工单状态若为 wait_for_audit, 返回 审核通过按钮, 并且根据 canRejectOrder 判断是否渲染 全部驳回按钮
   *    3. 当前步骤为 上线工单时
   *       1. 通过工单步骤状态判断当前是否已经审核, 若已审核, 返回 上线状态, 若未审核, 走 2
   *       2. 当前工单状态若为 wait_for_execution, 返回 批量立即上线按钮
   *       3. 判断当前时间以及运维时间, 若当前时间在数据源运维时间之外, 返回提示信息以及展示出详细的运维时间, 同时禁用 立即上线按钮.
   *
   *  4. 处理 currentStep 为 undefined 情况
   *    1. 当前工单是 rejected 状态
   *    2. 当前工单是 canceled 状态
   *    3. 当前工单是 finished 状态
   */

  const generateActionNode = (
    step: IWorkflowStepResV2,
    {
      maintenanceTimeInfoNode,
      modifySqlNode,
      sqlReviewNode,
      batchSqlExecuteNode,
      rejectFullNode,
      finishNode,
    }: ActionNodeType
  ) => {
    const genRejectedNode = () => {
      return (
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
    };

    const genModifySqlNode = () => {
      if (readonly) {
        return null;
      }
      if (currentOrderStatus === WorkflowRecordResV2StatusEnum.rejected) {
        if (step.operation_user_name === username) {
          return modifySqlNode;
        }

        return t('order.operator.waitModifySql', {
          username: step.operation_user_name,
        });
      }

      return null;
    };

    const genReviewNode = () => {
      if (orderStateIsApproved(step.state)) {
        return null;
      }

      if (currentOrderStatus === WorkflowRecordResV2StatusEnum.wait_for_audit) {
        return (
          <Space wrap>
            {sqlReviewNode}
            {canRejectOrder ? rejectFullNode : null}
          </Space>
        );
      }

      if (orderStateIsRejected(step.state)) {
        return genRejectedNode();
      }

      if (currentOrderStatus === WorkflowRecordResV2StatusEnum.rejected) {
        return t('order.operator.alreadyRejected');
      }

      if (
        currentOrderStatus === WorkflowRecordResV2StatusEnum.canceled &&
        orderStateIsInitialized(step.state)
      ) {
        return t('order.operator.alreadyClosed');
      }

      return null;
    };

    const genExecuteNode = () => {
      if (orderStateIsApproved(step.state)) {
        return (
          <span>
            {t('order.operator.status')}
            ：
            <OrderStatusTag status={currentOrderStatus} />
          </span>
        );
      }
      if (
        currentOrderStatus === WorkflowRecordResV2StatusEnum.wait_for_execution
      ) {
        return (
          <>
            <Space wrap>
              {batchSqlExecuteNode}
              {canRejectOrder ? rejectFullNode : null}
              {finishNode}
            </Space>
            {maintenanceTimeInfoNode}
          </>
        );
      }
      if (orderStateIsRejected(step.state)) {
        return genRejectedNode();
      }

      if (currentOrderStatus === WorkflowRecordResV2StatusEnum.rejected) {
        return t('order.operator.alreadyRejected');
      }

      if (
        currentOrderStatus === WorkflowRecordResV2StatusEnum.canceled &&
        orderStateIsInitialized(step.state)
      ) {
        return t('order.operator.alreadyClosed');
      }

      return null;
    };

    const genNodeWithOrderType = (_isCurrentStep: boolean) => {
      if (orderTypeIsCreate(step.type) || orderTypeIsUpdate(step.type)) {
        return genModifySqlNode();
      }
      if (orderTypeIsReview(step.type)) {
        return genReviewNode();
      }
      if (orderTypeIsExecute(step.type)) {
        return genExecuteNode();
      }
    };

    const genNodeWithPermissions = (_isCurrentStep: boolean) => {
      if (step.assignee_user_name_list?.includes(username) || !_isCurrentStep) {
        return genNodeWithOrderType(_isCurrentStep);
      }

      return t('order.operator.wait', {
        username: step.assignee_user_name_list?.join(','),
      });
    };

    const genNodeWithCurrentStep = () => {
      if (currentStep === undefined) {
        return genNodeWithPermissions(false);
      }

      if (step.number === undefined) {
        return t('order.operator.stepNumberIsUndefined');
      }

      if (step.number > currentStep) {
        return t('order.operator.notArrival');
      }

      if (step.number < currentStep) {
        return null;
      }

      if (step.number === currentStep) {
        return genNodeWithPermissions(true);
      }
    };

    return genNodeWithCurrentStep();
  };

  /**
   * 当工单类型为 上线工单时, 第三列需要展示当前工单下每项数据源的上线状态, 其他情况下展示操作时间以及操作人
   */
  const generateOperateInfo = (step: IWorkflowStepResV2) => {
    if (orderTypeIsExecute(step.type)) {
      return (
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

    return (
      <>
        <Col span={24}>
          {t('order.operator.time')}：{formatTime(step.operation_time, '--')}
        </Col>
        <Col span={24}>
          {t('order.operator.user')}：{step.operation_user_name ?? '--'}
        </Col>
      </>
    );
  };

  const generateTimeLineIcon = (step: IWorkflowStepResV2) => {
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
    generateStepTypeString,
    generateTimeLineIcon,
    generateOperateInfo,
    generateActionNode,
  };
};
