import { cleanup, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowStepResV1TypeEnum,
} from '../../../../../api/common.enum';
import { mockUseSelector } from '../../../../../testUtils/mockRedux';
import { useGenerateOrderStepInfo } from '../useGenerateOrderStepInfo';
import { defaultProps, otherStepList, stepList } from './testData';

const modifySqlNode = <>modifySqlNode</>;
const defaultActionNode = <>defaultActionNode</>;

const renderJsx = (jsx: JSX.Element | string | null) => {
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

  test('should return expect value with getStepTypeString', () => {
    const { result } = renderHook(() => useGenerateOrderStepInfo(defaultProps));

    expect(result.current.getStepTypeString(undefined)).toBe('unknown');
    expect(
      result.current.getStepTypeString(
        WorkflowStepResV1TypeEnum.create_workflow
      )
    ).toBe('order.operator.createOrderStep');
    expect(
      result.current.getStepTypeString(
        WorkflowStepResV1TypeEnum.update_workflow
      )
    ).toBe('order.operator.updateOrderStep');
    expect(
      result.current.getStepTypeString(WorkflowStepResV1TypeEnum.sql_review)
    ).toBe('order.operator.reviewOrderStep');
    expect(
      result.current.getStepTypeString(WorkflowStepResV1TypeEnum.sql_execute)
    ).toBe('order.operator.executeOrderStep');
  });

  test('should return expect value with getTimeLineIcon', () => {
    const { result, rerender } = renderHook((props = defaultProps) =>
      useGenerateOrderStepInfo(props as any)
    );

    expect(result.current.getTimeLineIcon(stepList[0]).color).toBe('green');

    expect(result.current.getTimeLineIcon(stepList[2])).toEqual({
      icon: undefined,
      color: 'green',
    });

    rerender({ ...defaultProps, currentStep: 3 });

    expect(result.current.getTimeLineIcon(stepList[2]).icon).toMatchSnapshot();

    rerender({
      ...defaultProps,
      currentOrderStatus: WorkflowRecordResV2StatusEnum.executing,
    });
    expect(result.current.getTimeLineIcon(stepList[2]).icon).toMatchSnapshot();
  });

  test('should return expect value with getStepActionAndOperateInfo', () => {
    const { result, rerender } = renderHook((props = { ...defaultProps }) =>
      useGenerateOrderStepInfo(props as any)
    );

    const createOrder = result.current.getStepActionAndOperateInfo(
      stepList[0],
      modifySqlNode,
      defaultActionNode
    );
    expect(createOrder.actionNode).toMatchSnapshot();
    expect(createOrder.operateInfo).toMatchSnapshot();

    rerender({ ...defaultProps, readonly: true });
    expect(
      result.current.getStepActionAndOperateInfo(
        stepList[0],
        modifySqlNode,
        defaultActionNode
      ).actionNode
    ).toBeNull();

    rerender({ ...defaultProps, currentStep: 2 });
    const notAssignee = result.current.getStepActionAndOperateInfo(
      { ...stepList[1], assignee_user_name_list: ['test'] },
      modifySqlNode,
      defaultActionNode
    );
    renderJsx(notAssignee.actionNode);
    expect(screen.getByText('order.operator.wait')).toBeInTheDocument();
    expect(createOrder.operateInfo).toMatchSnapshot();
    cleanup();

    const updateOrder = result.current.getStepActionAndOperateInfo(
      otherStepList[0],
      modifySqlNode,
      defaultActionNode
    );
    expect(updateOrder.actionNode).toMatchSnapshot();
    expect(updateOrder.operateInfo).toMatchSnapshot();

    const approvedAndReviewOrder = result.current.getStepActionAndOperateInfo(
      stepList[1],
      modifySqlNode,
      defaultActionNode
    );
    expect(approvedAndReviewOrder.actionNode).toBeNull();
    expect(approvedAndReviewOrder.operateInfo).toMatchSnapshot();

    rerender({ ...defaultProps, currentStep: 3 });
    const approvedAndExecuteOrder = result.current.getStepActionAndOperateInfo(
      stepList[2],
      modifySqlNode,
      defaultActionNode
    );

    renderJsx(approvedAndExecuteOrder.actionNode);
    expect(screen.getByText('order.operator.status：')).toBeInTheDocument();
    expect(approvedAndExecuteOrder.actionNode).toMatchSnapshot();
    cleanup();

    renderJsx(approvedAndExecuteOrder.operateInfo);
    expect(screen.getByText('order.status.finished：1')).toBeInTheDocument();
    expect(screen.getByText('order.status.exec_failed：0')).toBeInTheDocument();
    expect(screen.getByText('order.status.executing：0')).toBeInTheDocument();
    expect(approvedAndExecuteOrder.operateInfo).toMatchSnapshot();
    cleanup();

    rerender({ ...defaultProps, currentStep: 1 });
    const notArrival = result.current.getStepActionAndOperateInfo(
      stepList[2],
      modifySqlNode,
      defaultActionNode
    );
    renderJsx(notArrival.actionNode);
    expect(screen.getByText('order.operator.notArrival')).toBeInTheDocument();
    expect(approvedAndExecuteOrder.operateInfo).toMatchSnapshot();
    cleanup();

    rerender({
      ...defaultProps,
      currentOrderStatus: WorkflowRecordResV2StatusEnum.canceled,
    });
    const alreadyClosed = result.current.getStepActionAndOperateInfo(
      otherStepList[1],
      modifySqlNode,
      defaultActionNode
    );

    renderJsx(alreadyClosed.actionNode);
    expect(
      screen.getByText('order.operator.alreadyClosed')
    ).toBeInTheDocument();
    expect(alreadyClosed.operateInfo).toMatchSnapshot();
    cleanup();

    rerender({
      ...defaultProps,
    });

    const alreadyRejected = result.current.getStepActionAndOperateInfo(
      otherStepList[1],
      modifySqlNode,
      defaultActionNode
    );

    renderJsx(alreadyRejected.actionNode);
    expect(
      screen.getByText('order.operator.alreadyRejected')
    ).toBeInTheDocument();
    expect(alreadyRejected.operateInfo).toMatchSnapshot();
    cleanup();

    const rejectDetail = result.current.getStepActionAndOperateInfo(
      otherStepList[2],
      modifySqlNode,
      defaultActionNode
    );
    renderJsx(rejectDetail.actionNode);
    expect(screen.getByText('order.operator.rejectDetail')).toBeInTheDocument();
    expect(rejectDetail.actionNode).toMatchSnapshot();
    expect(rejectDetail.operateInfo).toMatchSnapshot();
  });
});
