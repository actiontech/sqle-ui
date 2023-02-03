import { cleanup, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  WorkflowDetailResV1StatusEnum,
  WorkflowStepResV2TypeEnum,
} from '../../../../../api/common.enum';
import { mockUseSelector } from '../../../../../testUtils/mockRedux';
import { useGenerateOrderStepInfo } from '../useGenerateOrderStepInfo';
import {
  defaultProps,
  executeStepList,
  otherStepList,
  stepList,
} from './testData';

const modifySqlNode = <>modifySqlNode</>;
const sqlReviewNode = <>sqlReviewNode</>;
const batchSqlExecuteNode = <>batchSqlExecuteNode</>;
const rejectFullNode = <>rejectFullNode</>;
const maintenanceTimeInfoNode = <>maintenanceTimeInfoNode</>;
const finishNode = <>finishNode</>;

const actionNode = {
  modifySqlNode,
  sqlReviewNode,
  batchSqlExecuteNode,
  rejectFullNode,
  maintenanceTimeInfoNode,
  finishNode,
};

const renderJsx = (jsx?: JSX.Element | string | null) => {
  const Element = () => <>{jsx}</>;
  return render(<Element />);
};

describe('test useGenerateOrderStepInfo', () => {
  beforeEach(() => {
    mockUseSelector({ user: { username: 'admin' } });
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

    const createOrder = result.current.generateActionNode(
      stepList[0],
      actionNode
    );
    expect(createOrder).toMatchSnapshot();

    rerender({ ...defaultProps, readonly: true });
    expect(
      result.current.generateActionNode(stepList[0], actionNode)
    ).toBeNull();

    rerender({ ...defaultProps, currentStep: 2 });
    const notAssignee = result.current.generateActionNode(
      { ...stepList[1], assignee_user_name_list: ['test'] },
      actionNode
    );
    renderJsx(notAssignee);
    expect(screen.getByText('order.operator.wait')).toBeInTheDocument();
    expect(notAssignee).toMatchSnapshot();
    cleanup();

    const updateOrder = result.current.generateActionNode(
      otherStepList[0],
      actionNode
    );
    expect(updateOrder).toMatchSnapshot();

    const approvedAndReviewOrder = result.current.generateActionNode(
      stepList[1],
      actionNode
    );
    expect(approvedAndReviewOrder).toBeNull();

    rerender({ ...defaultProps, currentStep: 3 });
    const approvedAndExecuteOrder = result.current.generateActionNode(
      stepList[2],
      actionNode
    );

    renderJsx(approvedAndExecuteOrder);
    expect(screen.getByText('order.operator.status：')).toBeInTheDocument();
    cleanup();

    rerender({ ...defaultProps, currentStep: 1 });
    const notArrival = result.current.generateActionNode(
      stepList[2],
      actionNode
    );
    renderJsx(notArrival);
    expect(screen.getByText('order.operator.notArrival')).toBeInTheDocument();
    cleanup();

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

    rerender({
      ...defaultProps,
    });

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

    const rejectDetail = result.current.generateActionNode(
      otherStepList[2],
      actionNode
    );
    renderJsx(rejectDetail);
    expect(screen.getByText('order.operator.rejectDetail')).toBeInTheDocument();
  });

  test('should return expect value with generateOperateInfo', () => {
    const { result } = renderHook((props = defaultProps) =>
      useGenerateOrderStepInfo(props as any)
    );

    const executeNode = result.current.generateOperateInfo(executeStepList[2]);

    renderJsx(executeNode);

    expect(screen.queryByText('order.status.finished：1')).toBeInTheDocument();
    expect(
      screen.queryByText('order.status.exec_failed：0')
    ).toBeInTheDocument();
    expect(screen.queryByText('order.status.executing：0')).toBeInTheDocument();
    cleanup();

    const otherNode = result.current.generateOperateInfo(otherStepList[0]);
    expect(otherNode).toMatchSnapshot();
  });
});
