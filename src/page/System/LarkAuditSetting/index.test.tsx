import {
  fireEvent,
  render,
  screen,
  act,
  cleanup,
} from '@testing-library/react';
import LarkAuditSetting from '.';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { TestFeishuConfigurationReqV1AccountTypeEnum } from '../../../api/common.enum';

describe('test System/LarkAuditSetting', () => {
  let getLarkAuditConfigSpy: jest.SpyInstance;
  let updateLarkAuditConfigSpy: jest.SpyInstance;
  let testLarkAuditConfigSpy: jest.SpyInstance;
  beforeEach(() => {
    getLarkAuditConfigSpy = mockGetLarkConfiguration();
    updateLarkAuditConfigSpy = mockUpdateLarkConfiguration();
    testLarkAuditConfigSpy = mockTestLarkConfiguration();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  const mockGetLarkConfiguration = () => {
    const spy = jest.spyOn(configuration, 'getFeishuAuditConfigurationV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        app_id: 'app_id',
        is_feishu_notification_enabled: true,
      })
    );
    return spy;
  };

  const mockTestLarkConfiguration = () => {
    const spy = jest.spyOn(configuration, 'testFeishuAuditConfigV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        is_message_sent_normally: true,
      })
    );
    return spy;
  };

  const mockUpdateLarkConfiguration = () => {
    const spy = jest.spyOn(configuration, 'updateFeishuAuditConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    expect(getLarkAuditConfigSpy).toBeCalledTimes(0);
    const { container } = render(<LarkAuditSetting />);
    expect(container).toMatchSnapshot();

    expect(getLarkAuditConfigSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.modify'));
    expect(container).toMatchSnapshot();
  });

  test('should disabled edit lark audit configuration when "is_feishu_notification_enabled" is equal false', async () => {
    getLarkAuditConfigSpy.mockImplementation(() =>
      resolveThreeSecond({
        app_id: 'app_key',
        is_feishu_notification_enabled: false,
      })
    );
    const { container } = render(<LarkAuditSetting />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.modify'));
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByLabelText('system.larkAudit.enable'));
    expect(container).toMatchSnapshot();
  });

  test('should be able to update dingTalk configuration', async () => {
    render(<LarkAuditSetting />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.modify'));
    fireEvent.click(screen.getByLabelText('system.larkAudit.enable'));
    expect(screen.queryByLabelText('App ID')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('App Secret')).not.toBeInTheDocument();

    expect(updateLarkAuditConfigSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateLarkAuditConfigSpy).toBeCalledTimes(1);
    expect(updateLarkAuditConfigSpy).toBeCalledWith({
      is_feishu_notification_enabled: false,
    });
    expect(screen.getByText('common.submit').closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    expect(screen.getByText('common.cancel').closest('button')).toBeDisabled();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.submit').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );

    expect(
      screen.getByText('common.cancel').closest('button')
    ).not.toBeDisabled();

    expect(getLarkAuditConfigSpy).toBeCalledTimes(2);
    expect(screen.getByText('common.modify')).toBeInTheDocument();
  });

  test('should send request when clicking test DingTalk button', async () => {
    const { baseElement } = render(<LarkAuditSetting />);
    expect(testLarkAuditConfigSpy).toBeCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('system.larkAudit.test'));

    expect(
      screen.getByText('system.larkAudit.receiveType')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.change(screen.getAllByLabelText('system.larkAudit.email')[1], {
      target: { value: 'demo@gmail.com' },
    });

    fireEvent.click(screen.getByText('common.ok'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(testLarkAuditConfigSpy).toBeCalledTimes(1);
    expect(testLarkAuditConfigSpy).nthCalledWith(1, {
      account: 'demo@gmail.com',
      account_type: TestFeishuConfigurationReqV1AccountTypeEnum.email,
    });

    expect(screen.getByText('system.larkAudit.testing')).toBeInTheDocument();
    expect(
      screen.getByText('system.larkAudit.test').closest('button')
    ).not.toBeDisabled();

    expect(
      screen.getByText('common.modify').closest('button')
    ).not.toBeDisabled();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('system.larkAudit.testing')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('system.larkAudit.test').closest('button')
    ).not.toBeDisabled();
    expect(
      screen.getByText('common.modify').closest('button')
    ).not.toBeDisabled();

    expect(
      screen.getByText('system.larkAudit.testSuccess')
    ).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('system.larkAudit.testSuccess')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByText('system.larkAudit.phone')[0]);
    fireEvent.change(screen.getAllByLabelText('system.larkAudit.phone')[1], {
      target: { value: '13112341234' },
    });

    fireEvent.click(screen.getByText('common.ok'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(testLarkAuditConfigSpy).toBeCalledTimes(2);
    expect(testLarkAuditConfigSpy).nthCalledWith(2, {
      account: '13112341234',
      account_type: TestFeishuConfigurationReqV1AccountTypeEnum.phone,
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    jest.clearAllMocks();
    testLarkAuditConfigSpy.mockImplementation(() => {
      return resolveThreeSecond({
        is_message_sent_normally: false,
        error_message: 'error message',
      });
    });
    fireEvent.click(screen.getByText('system.larkAudit.test'));
    fireEvent.change(screen.getAllByLabelText('system.larkAudit.email')[1], {
      target: { value: 'demo@gmail.com' },
    });

    fireEvent.click(screen.getByText('common.ok'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(testLarkAuditConfigSpy).toBeCalledTimes(1);
    expect(testLarkAuditConfigSpy).nthCalledWith(1, {
      account: 'demo@gmail.com',
      account_type: TestFeishuConfigurationReqV1AccountTypeEnum.email,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('error message')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('error message')).not.toBeInTheDocument();
  });

  test('should be disabled test button when config switch is off', async () => {
    getLarkAuditConfigSpy.mockImplementation(() =>
      resolveThreeSecond({
        app_id: 'app_id',
        is_feishu_notification_enabled: false,
      })
    );
    render(<LarkAuditSetting />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('system.larkAudit.test').closest('button')
    ).toBeDisabled();

    fireEvent.click(screen.getByText('system.larkAudit.test'));

    expect(
      screen.queryByText('system.larkAudit.receiveType')
    ).not.toBeInTheDocument();
  });
});
