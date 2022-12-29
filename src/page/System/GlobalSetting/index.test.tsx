import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import GlobalConfig from '.';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

describe('System/GlobalConfig', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetGlobalConfig = () => {
    const spy = jest.spyOn(configuration, 'getSystemVariablesV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        workflow_expired_hours: 720,
        url: 'http://127.0.0.1:5151',
      })
    );
    return spy;
  };

  const mockUpdateGlobalConfig = () => {
    const spy = jest.spyOn(configuration, 'updateSystemVariablesV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should get smtp setting from origin', async () => {
    mockGetGlobalConfig();
    const { container } = render(<GlobalConfig />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should send update config request when user click save modify button', async () => {
    mockGetGlobalConfig();
    const updateSpy = mockUpdateGlobalConfig();

    render(<GlobalConfig />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('common.modify'));
    fireEvent.input(
      screen.getByLabelText(
        'system.global.orderExpiredHours(common.time.hour)'
      ),
      {
        target: { value: 800 },
      }
    );

    fireEvent.input(screen.getByLabelText('system.global.urlAddressPrefix'), {
      target: 'http://127.0.0.1:5151',
    });

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      workflow_expired_hours: 800,
      url: 'http://127.0.0.1:5151',
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.cancel').parentNode).toHaveAttribute(
      'disabled'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.cancel').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });
});
