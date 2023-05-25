import { cleanup, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  WorkflowDetailResV1StatusEnum,
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV2StateEnum,
  WorkflowStepResV2TypeEnum,
} from '../../../../../api/common.enum';
import { useGenerateOrderStepInfo } from '../useGenerateOrderStepInfo';
import {
  defaultProps,
  executeStepList,
  otherStepList,
  stepList,
} from './testData';
import { useSelector } from 'react-redux';

const modifySqlNode = <>modifySqlNode</>;
const sqlReviewNode = <>sqlReviewNode</>;
const batchSqlExecuteNode = <>batchSqlExecuteNode</>;
const rejectFullNode = <>rejectFullNode</>;
const maintenanceTimeInfoNode = <>maintenanceTimeInfoNode</>;
const finishNode = <>finishNode</>;
const terminateNode = <>terminateNode</>;

const actionNode = {
  modifySqlNode,
  sqlReviewNode,
  batchSqlExecuteNode,
  rejectFullNode,
  maintenanceTimeInfoNode,
  finishNode,
  terminateNode,
};

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

const renderJsx = (jsx?: JSX.Element | string | null) => {
  const Element = () => <>{jsx}</>;
  return render(<Element />);
};

describe('test useGenerateOrderStepInfo', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { username: 'admin' },
      })
    );
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('should return expect value with generateStepTypeString', () => {
    const { result } = renderHook(() => useGenerateOrderStepInfo(defaultProps));

    expect(result.current.generateStepTypeString(undefined)).toBe(
      'order.operator.unknown'
    );
    expect(
      result.current.generateStepTypeString(
        WorkflowStepResV2TypeEnum.create_workflow
      )
    ).toBe('order.operator.createOrderStep');
    expect(
      result.current.generateStepTypeString(
        WorkflowStepResV2TypeEnum.update_workflow
      )
    ).toBe('order.operator.updateOrderStep');
    expect(
      result.current.generateStepTypeString(
        WorkflowStepResV2TypeEnum.sql_review
      )
    ).toBe('order.operator.reviewOrderStep');
    expect(
      result.current.generateStepTypeString(
        WorkflowStepResV2TypeEnum.sql_execute
      )
    ).toBe('order.operator.executeOrderStep');
  });

  test('should return expect value with generateTimeLineIcon', () => {
    const { result, rerender } = renderHook((props = defaultProps) =>
      useGenerateOrderStepInfo(props as any)
    );

    expect(result.current.generateTimeLineIcon(stepList[0]).color).toBe(
      'green'
    );

    expect(result.current.generateTimeLineIcon(stepList[2])).toEqual({
      icon: undefined,
      color: 'green',
    });

    rerender({ ...defaultProps, currentStep: 3 });

    expect(
      result.current.generateTimeLineIcon(stepList[2]).icon
    ).toMatchSnapshot();

    rerender({
      ...defaultProps,
      currentOrderStatus: WorkflowDetailResV1StatusEnum.executing,
    });
    expect(
      result.current.generateTimeLineIcon(stepList[2]).icon
    ).toMatchSnapshot();
  });

  test('should return expect value with generateActionNode', () => {
    const { result, rerender } = renderHook((props = { ...defaultProps }) =>
      useGenerateOrderStepInfo(props as any)
    );

    /*
     *  render Modify Sql Node
     *  condition: currentUsername in assignee_user_name_list && orderTypeIsCreate && currentOrderStatus !==  WorkflowRecordResV2StatusEnum.rejected
     *  expect: null
     */
    expect(
      result.current.generateActionNode(stepList[0], actionNode)
    ).toBeNull();
    cleanup();

    /*
     *  render Modify Sql Node
     *  condition: currentUsername in assignee_user_name_list && orderTypeIsCreate
     *             && currentOrderStatus ===  WorkflowRecordResV2StatusEnum.rejected && readonly
     *  expect: null
     */
    rerender({
      ...defaultProps,
      readonly: true,
      currentOrderStatus: WorkflowRecordResV2StatusEnum.rejected,
    });
    expect(
      result.current.generateActionNode(stepList[0], actionNode)
    ).toBeNull();
    cleanup();

    /*
     * render Modify Sql Node
     * condition: currentStep === undefined && (orderTypeIsCreate || orderTypeIsUpdate) && currentOrderStatus === WorkflowRecordResV2StatusEnum.rejected && !readonly
     * expect: Modify Node
     */
    rerender({
      ...defaultProps,
      currentOrderStatus: WorkflowRecordResV2StatusEnum.rejected,
    });
    const updateOrder = result.current.generateActionNode(
      stepList[0],
      actionNode
    );
    expect(updateOrder).toMatchSnapshot();
    cleanup();

    /*
     * step.operation_user_name !== currentUsername
     * expect: order.operator.waitModifySql
     */
    renderJsx(
      result.current.generateActionNode(
        { ...stepList[0], operation_user_name: 'test' },
        actionNode
      )
    );
    expect(
      screen.getByText('order.operator.waitModifySql')
    ).toBeInTheDocument();
    cleanup();

    /*
     * render wait info
     * condition: currentUsername not in assignee_user_name_list && currentStep !== undefined && currentStep === step.number
     * expect: order.operator.wait
     */
    rerender({ ...defaultProps, currentStep: 2 });
    const notAssignee = result.current.generateActionNode(
      { ...stepList[1], assignee_user_name_list: ['test'] },
      actionNode
    );
    renderJsx(notAssignee);
    expect(screen.getByText('order.operator.wait')).toBeInTheDocument();
    expect(notAssignee).toMatchSnapshot();
    cleanup();

    /*
     * render review
     * condition: currentStep === step.number && currentUsername in assignee_user_name_list && orderTypeIsReview && orderStateIsApproved
     * expect: null
     */
    const approvedAndReviewOrder = result.current.generateActionNode(
      stepList[1],
      actionNode
    );
    expect(approvedAndReviewOrder).toBeNull();
    cleanup();

    /*
     * render review
     * condition: currentStep === step.number && currentUsername in assignee_user_name_list && orderTypeIsReview && step.state !== WorkflowStepResV2StateEnum.approved && currentOrderStatus === WorkflowRecordResV2StatusEnum.wait_for_audit && canRejectOrder
     * expect: sqlReviewNode and rejectFullNode
     */
    rerender({
      ...defaultProps,
      currentStep: 2,
      currentOrderStatus: WorkflowRecordResV2StatusEnum.wait_for_audit,
    });
    const auditNode = result.current.generateActionNode(
      { ...stepList[1], state: WorkflowStepResV2StateEnum.initialized },
      actionNode
    );
    renderJsx(auditNode);
    expect(screen.getByText('sqlReviewNode')).toBeInTheDocument();
    expect(screen.getByText('rejectFullNode')).toBeInTheDocument();
    expect(auditNode).toMatchSnapshot();
    cleanup();

    /*
     * render review
     * condition: currentStep === step.number && currentUsername in assignee_user_name_list && orderTypeIsReview && currentOrderStatus === WorkflowRecordResV2StatusEnum.wait_for_audit && !canRejectOrder
     * expect: sqlReviewNode
     */
    rerender({
      ...defaultProps,
      currentStep: 2,
      currentOrderStatus: WorkflowRecordResV2StatusEnum.wait_for_audit,
      canRejectOrder: false,
    });
    const auditNode2 = result.current.generateActionNode(
      { ...stepList[1], state: WorkflowStepResV2StateEnum.initialized },
      actionNode
    );
    renderJsx(auditNode2);
    expect(screen.getByText('sqlReviewNode')).toBeInTheDocument();
    expect(screen.queryByText('rejectFullNode')).not.toBeInTheDocument();
    expect(auditNode).toMatchSnapshot();
    cleanup();

    /*
     * render execute
     * condition: currentStep === step.number && currentUsername in assignee_user_name_list && orderTypeIsExecute && orderStateIsApproved &&  currentOrderStatus !== WorkflowRecordResV2StatusEnum.executing
     * expect: order.operator.status：
     */
    rerender({ ...defaultProps, currentStep: 3 });
    const approvedAndExecuteOrder = result.current.generateActionNode(
      stepList[2],
      actionNode
    );

    renderJsx(approvedAndExecuteOrder);
    expect(screen.getByText('order.operator.status：')).toBeInTheDocument();
    cleanup();

    /*
     * render execute
     * condition: currentStep === step.number && currentUsername in assignee_user_name_list && orderTypeIsExecute && orderStateIsApproved &&  currentOrderStatus === WorkflowRecordResV2StatusEnum.executing
     * expect: order.operator.status： and terminateNode
     */
    rerender({
      ...defaultProps,
      currentStep: 3,
      currentOrderStatus: WorkflowRecordResV2StatusEnum.executing,
    });
    const terminateNode = result.current.generateActionNode(
      stepList[2],
      actionNode
    );

    renderJsx(terminateNode);
    expect(screen.getByText('order.operator.status：')).toBeInTheDocument();
    expect(screen.getByText('terminateNode')).toBeInTheDocument();
    expect(terminateNode).toMatchSnapshot();
    cleanup();

    /*
     * render execute
     * condition: currentStep === step.number && currentUsername in assignee_user_name_list && orderTypeIsExecute && !orderStateIsApproved &&  currentOrderStatus === WorkflowRecordResV2StatusEnum.wait_for_execution && canRejectOrder
     * expect: order.operator.status： and terminateNode
     */
    rerender({
      ...defaultProps,
      currentStep: 3,
      currentOrderStatus: WorkflowRecordResV2StatusEnum.wait_for_execution,
    });

    const executeNode = renderJsx(
      result.current.generateActionNode(
        { ...stepList[2], state: WorkflowStepResV2StateEnum.initialized },
        actionNode
      )
    );
    expect(screen.getByText('batchSqlExecuteNode')).toBeInTheDocument();
    expect(screen.getByText('rejectFullNode')).toBeInTheDocument();
    expect(screen.getByText('finishNode')).toBeInTheDocument();
    expect(executeNode).toMatchSnapshot();
    cleanup();

    /*
     * render execute
     * condition: currentStep === step.number && currentUsername in assignee_user_name_list && orderTypeIsExecute && !orderStateIsApproved &&  currentOrderStatus === WorkflowRecordResV2StatusEnum.wait_for_execution && !canRejectOrder
     * expect: order.operator.status： and terminateNode
     */
    rerender({
      ...defaultProps,
      currentStep: 3,
      currentOrderStatus: WorkflowRecordResV2StatusEnum.wait_for_execution,
      canRejectOrder: false,
    });

    renderJsx(
      result.current.generateActionNode(
        { ...stepList[2], state: WorkflowStepResV2StateEnum.initialized },
        actionNode
      )
    );
    expect(screen.getByText('batchSqlExecuteNode')).toBeInTheDocument();
    expect(screen.queryByText('rejectFullNode')).not.toBeInTheDocument();
    expect(screen.getByText('finishNode')).toBeInTheDocument();
    cleanup();

    /*
     * render notArrival
     * condition: step.number > currentStep
     * expect: order.operator.notArrival
     */
    rerender({ ...defaultProps, currentStep: 1 });
    const notArrival = result.current.generateActionNode(
      stepList[2],
      actionNode
    );
    renderJsx(notArrival);
    expect(screen.getByText('order.operator.notArrival')).toBeInTheDocument();
    cleanup();

    /*
     * render review
     * condition: currentStep === undefined && orderTypeIsReview && currentOrderStatus === WorkflowRecordResV2StatusEnum.canceled && orderStateIsInitialized
     * expect: order.operator.alreadyClosed
     */
    rerender({
      ...defaultProps,
      currentOrderStatus: WorkflowDetailResV1StatusEnum.canceled,
    });
    const alreadyClosed = result.current.generateActionNode(
      otherStepList[1],
      actionNode
    );

    renderJsx(alreadyClosed);
    expect(
      screen.getByText('order.operator.alreadyClosed')
    ).toBeInTheDocument();
    cleanup();

    /*
     *  render review
     *  condition: currentStep === undefined && orderTypeIsReview && currentOrderStatus === WorkflowRecordResV2StatusEnum.rejected && !orderStateIsRejected
     *  expect: order.operator.alreadyRejected
     */
    rerender({
      ...defaultProps,
      currentOrderStatus: WorkflowDetailResV1StatusEnum.rejected,
    });
    const alreadyRejected = result.current.generateActionNode(
      otherStepList[1],
      actionNode
    );

    renderJsx(alreadyRejected);
    expect(
      screen.getByText('order.operator.alreadyRejected')
    ).toBeInTheDocument();
    cleanup();

    /*
     *  render review
     *  condition: currentStep === undefined && orderTypeIsReview && orderStateIsRejected
     *  expect: order.operator.rejectDetail
     */
    const rejectDetail = result.current.generateActionNode(
      otherStepList[2],
      actionNode
    );
    renderJsx(rejectDetail);
    expect(screen.getByText('order.operator.rejectDetail')).toBeInTheDocument();
    cleanup();

    /*
     * condition: step.number === undefined
     */
    rerender({
      ...defaultProps,
      currentStep: 1,
    });
    renderJsx(
      result.current.generateActionNode(
        { ...otherStepList[1], number: undefined },
        actionNode
      )
    );
    expect(
      screen.getByText('order.operator.stepNumberIsUndefined')
    ).toBeInTheDocument();
    cleanup();

    /*
     * condition: step.number < currentStep
     * expect: null
     */
    rerender({
      ...defaultProps,
      currentStep: 3,
    });

    expect(
      result.current.generateActionNode(otherStepList[1], actionNode)
    ).toBeNull();
  });

  test('should return expect value with generateOperateInfo', () => {
    const { result } = renderHook((props = defaultProps) =>
      useGenerateOrderStepInfo(props as any)
    );

    const executeNode = result.current.generateOperateInfo(executeStepList[2]);

    renderJsx(executeNode);

    expect(screen.getByText('order.status.finished：1')).toBeInTheDocument();
    expect(screen.getByText('order.status.exec_failed：0')).toBeInTheDocument();
    expect(screen.getByText('order.status.executing：0')).toBeInTheDocument();
    cleanup();

    const otherNode = result.current.generateOperateInfo(otherStepList[0]);
    expect(otherNode).toMatchSnapshot();
  });
});
