import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import SMTPSetting from '.';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

describe('System/SMTPSetting', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetSMTPInfo = () => {
    const spy = jest.spyOn(configuration, 'getSMTPConfigurationV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        enable_smtp_notify: true,
        smtp_host: '10.10.10.1',
        smtp_port: '3300',
        smtp_username: 'currentUser@gamil.com',
      })
    );
    return spy;
  };

  const mockTestEmail = () => {
    const spy = jest.spyOn(configuration, 'testSMTPConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockUpdateSMTPInfo = () => {
    const spy = jest.spyOn(configuration, 'updateSMTPConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should get smtp setting from origin', async () => {
    mockGetSMTPInfo();
    const { container } = render(<SMTPSetting />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should send update config request when user click save modify button', async () => {
    mockGetSMTPInfo();
    const updateSpy = mockUpdateSMTPInfo();

    render(<SMTPSetting />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('common.modify'));

    fireEvent.click(screen.getByLabelText('system.smtp.enable'));
    fireEvent.input(screen.getByLabelText('system.smtp.username'), {
      target: { value: 'newEmail@163.com' },
    });
    fireEvent.input(screen.getByLabelText('system.smtp.password'), {
      target: { value: 'temp' },
    });
    fireEvent.input(screen.getByLabelText('system.smtp.passwordConfirm'), {
      target: { value: 'temp' },
    });
    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      enable_smtp_notify: false,
      smtp_host: '10.10.10.1',
      smtp_password: 'temp',
      smtp_port: '3300',
      smtp_username: 'newEmail@163.com',
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

  test('should send test email request when user click test button', async () => {
    mockGetSMTPInfo();
    const testSpy = mockTestEmail();
    render(<SMTPSetting />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('system.smtp.test'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.input(screen.getByLabelText('system.smtp.receiver'), {
      target: { value: '123@123.com' },
    });
    fireEvent.click(screen.getByText('common.ok'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(testSpy).toBeCalledTimes(1);
    expect(testSpy).toBeCalledWith({
      recipient_addr: '123@123.com',
    });
    expect(screen.queryByText('system.smtp.testing')).toBeInTheDocument();

    fireEvent.click(screen.getByText('system.smtp.test'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.ok'));

    expect(testSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryByText('system.smtp.testing')).not.toBeInTheDocument();
    expect(screen.queryByText('system.smtp.testSuccess')).toBeInTheDocument();
  });
});
