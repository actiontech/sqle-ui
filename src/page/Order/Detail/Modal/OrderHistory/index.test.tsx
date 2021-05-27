import { fireEvent, render, screen } from '@testing-library/react';
import OrderHistory from '.';
import { mockUseSelector } from '../../../../../testUtils/mockRedux';
import { order, orderCancel, orderPass, orderReject } from '../../__testData__';

describe('Order/Detail/OrderHistory', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { username: '123' } });
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
          ] as any
        }
        close={close}
      />
    );
    expect(screen.queryByText('common.ok')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.ok'));
    expect(close).toBeCalledTimes(1);
  });
});
