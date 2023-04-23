import { fireEvent, render, screen } from '@testing-library/react';
import OrderHistory from '.';
import {
  order,
  orderCancel,
  orderPass,
  orderReject,
  orderWithExecScheduled,
  orderWithExecuting,
} from '../../__testData__';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('Order/Detail/OrderHistory', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { username: '123' },
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should render all order history', () => {
    const close = jest.fn();
    const { baseElement } = render(
      <OrderHistory
        visible={true}
        history={
          [
            {
              ...order.record,
            },
            {
              ...orderReject.record,
            },
            {
              ...orderCancel.record,
            },
            {
              ...orderPass.record,
            },
            {
              ...orderWithExecScheduled.record,
            },
            {
              ...orderWithExecuting.record,
            },
          ] as any
        }
        close={close}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  test('should call close when click submit button', () => {
    const close = jest.fn();
    render(
      <OrderHistory
        visible={true}
        history={
          [
            {
              ...order.record,
            },
            {
              ...orderReject.record,
            },
            {
              ...orderCancel.record,
            },
            {
              ...orderPass.record,
            },
            {
              ...orderWithExecScheduled.record,
            },
            {
              ...orderWithExecuting.record,
            },
          ] as any
        }
        close={close}
      />
    );
    expect(screen.getByText('common.ok')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.ok'));
    expect(close).toBeCalledTimes(1);
  });
});
