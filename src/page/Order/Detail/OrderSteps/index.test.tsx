import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import OrderSteps from '.';
import { IWorkflowResV1 } from '../../../../api/common';
import { getBySelector } from '../../../../testUtils/customQuery';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import {
  order,
  order3,
  orderCancel,
  orderCancel3,
  orderPass,
  orderPass3,
  orderReject,
  orderReject3,
} from '../__testData__';

describe('Order/Detail/OrderSteps', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { username: 'admin' } });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should match to snapshot when user is assignee user', () => {
    const { rerender, container } = render(
      <OrderSteps
        currentStep={order.record?.current_step_number}
        stepList={order.record?.workflow_step_list ?? []}
        pass={jest.fn()}
        reject={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={order.record?.status}
      />
    );
    expect(container).toMatchSnapshot();
    const data: IWorkflowResV1[] = [
      orderCancel,
      orderReject,
      orderPass,
      order3,
      orderCancel3,
      orderReject3,
      orderPass3,
    ];
    data.forEach((item) => {
      rerender(
        <OrderSteps
          currentStep={item.record?.current_step_number}
          stepList={item.record?.workflow_step_list ?? []}
          pass={jest.fn()}
          reject={jest.fn()}
          modifySql={jest.fn()}
          currentOrderStatus={order.record?.status}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  test('should match to snapshot when user is not assignee user', () => {
    mockUseSelector({ user: { username: 'test' } });
    const { rerender, container } = render(
      <OrderSteps
        currentStep={order.record?.current_step_number}
        stepList={order.record?.workflow_step_list ?? []}
        pass={jest.fn()}
        reject={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={order.record?.status}
      />
    );
    expect(container).toMatchSnapshot();
    const data: IWorkflowResV1[] = [
      orderCancel,
      orderReject,
      orderPass,
      order3,
      orderCancel3,
      orderReject3,
      orderPass3,
    ];
    data.forEach((item) => {
      rerender(
        <OrderSteps
          currentStep={item.record?.current_step_number}
          stepList={item.record?.workflow_step_list ?? []}
          pass={jest.fn()}
          reject={jest.fn()}
          modifySql={jest.fn()}
          currentOrderStatus={order.record?.status}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  test('should call pass func of props when click resolve button', async () => {
    const passMock = jest.fn().mockImplementation(() => resolveThreeSecond({}));
    render(
      <OrderSteps
        currentStep={order3.record?.current_step_number}
        stepList={order3.record?.workflow_step_list ?? []}
        pass={passMock}
        reject={jest.fn()}
        modifySql={jest.fn()}
        currentOrderStatus={order3.record?.status}
      />
    );
    expect(screen.queryByText('order.operator.sqlReview')).toBeInTheDocument();
    fireEvent.click(screen.getByText('order.operator.sqlReview'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('order.operator.sqlReview').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(passMock).toBeCalledTimes(1);
    expect(passMock).toBeCalledWith(21);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.operator.sqlReview').parentNode
    ).not.toHaveClass('ant-btn-loading');
  });

  test('should call reject func of props when click reject button', async () => {
    const rejectMock = jest
      .fn()
      .mockImplementation(() => resolveThreeSecond({}));
    render(
      <OrderSteps
        currentStep={order3.record?.current_step_number}
        stepList={order3.record?.workflow_step_list ?? []}
        pass={jest.fn()}
        reject={rejectMock}
        modifySql={jest.fn()}
        currentOrderStatus={order3.record?.status}
      />
    );
    expect(screen.queryByText('order.operator.reject')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByText('order.operator.reject'));
    });
    await waitFor(() => {
      jest.runOnlyPendingTimers();
    });
    expect(getBySelector('.ant-modal')).toBeInTheDocument();
    fireEvent.input(screen.getByLabelText('order.operator.rejectReason'), {
      target: { value: 'test reason' },
    });
    const rejectSubmit = getBySelector(
      '.ant-btn-primary',
      getBySelector('.ant-modal')
    );
    expect(rejectSubmit).toHaveTextContent('order.operator.reject');
    fireEvent.click(rejectSubmit);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(rejectMock).toBeCalledTimes(1);
    expect(rejectMock).toBeCalledWith('test reason', 21);
    expect(rejectSubmit).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(rejectSubmit).not.toHaveClass('ant-btn-loading');
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
  });
});
