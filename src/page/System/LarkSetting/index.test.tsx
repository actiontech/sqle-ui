import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LarkSetting from '.';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

describe('test System/LarkSetting', () => {
  let getLarkConfigSpy: jest.SpyInstance;
  let updateLarkConfigSpy: jest.SpyInstance;
  let testLarkConfigSpy: jest.SpyInstance;
  beforeEach(() => {
    getLarkConfigSpy = mockGetLarkConfiguration();
    updateLarkConfigSpy = mockUpdateLarkConfiguration();
    testLarkConfigSpy = mockTestLarkConfiguration();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockGetLarkConfiguration = () => {
    const spy = jest.spyOn(configuration, 'getFeishuConfigurationV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        app_id: 'app_id',
        is_feishu_notification_enabled: true,
      })
    );
    return spy;
  };

  const mockTestLarkConfiguration = () => {
    const spy = jest.spyOn(configuration, 'testFeishuConfigV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        is_message_sent_normally: true,
      })
    );
    return spy;
  };

  const mockUpdateLarkConfiguration = () => {
    const spy = jest.spyOn(configuration, 'updateFeishuConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    expect(getLarkConfigSpy).toBeCalledTimes(0);
    const { container } = render(<LarkSetting />);
    expect(container).toMatchSnapshot();

    expect(getLarkConfigSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.modify'));
    expect(container).toMatchSnapshot();
  });

  test('should disabled edit lark configuration when "is_enable_ding_talk_notify" is equal false', async () => {
    getLarkConfigSpy.mockImplementation(() =>
      resolveThreeSecond({
        app_id: 'app_key',
        is_enable_ding_talk_notify: false,
      })
    );
    const { container } = render(<LarkSetting />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.modify'));
    expect(container).toMatchSnapshot();
    expect(screen.getByLabelText('AppKey')).toHaveValue('app_key');
    expect(screen.getByLabelText('AppKey')).toBeDisabled();
    expect(screen.getByLabelText('AppSecret')).toBeDisabled();

    fireEvent.click(screen.getByLabelText('system.lark.enable'));
    expect(screen.getByLabelText('AppKey')).not.toBeDisabled();
    expect(screen.getByLabelText('AppSecret')).not.toBeDisabled();
  });

  test('should be able to update dingTalk configuration', async () => {
    render(<LarkSetting />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByText('common.modify'));
    fireEvent.click(screen.getByLabelText('system.lark.enable'));
    fireEvent.change(screen.getByLabelText('AppKey'), {
      target: { value: 'update-appKey' },
    });
    fireEvent.change(screen.getByLabelText('AppSecret'), {
      target: { value: 'update-appSecret' },
    });
    expect(updateLarkConfigSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(updateLarkConfigSpy).toBeCalledTimes(1);
    expect(updateLarkConfigSpy).toBeCalledWith({
      is_feishu_notification_enabled: false,
      app_id: 'update-appKey',
      app_secret: 'update-appSecret',
    });
    expect(screen.getByText('common.submit').closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    expect(screen.getByText('common.cancel').closest('button')).toBeDisabled();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText('common.submit').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );

    expect(
      screen.getByText('common.cancel').closest('button')
    ).not.toBeDisabled();

    expect(screen.getByLabelText('AppKey')).toHaveValue('');
    expect(screen.getByLabelText('AppSecret')).toHaveValue('');
    expect(getLarkConfigSpy).toBeCalledTimes(2);
    expect(screen.getByText('common.modify')).toBeInTheDocument();
  });

  test('should send request when clicking test DingTalk button', async () => {
    render(<LarkSetting />);
    expect(testLarkConfigSpy).toBeCalledTimes(0);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByText('system.lark.test'));

    expect(testLarkConfigSpy).toBeCalledTimes(1);

    expect(screen.queryByText('system.lark.testing')).toBeInTheDocument();
    expect(
      screen.getByText('system.lark.test').closest('button')
    ).toBeDisabled();

    expect(screen.getByText('common.modify').closest('button')).toBeDisabled();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryByText('system.lark.testing')).not.toBeInTheDocument();
    expect(
      screen.getByText('system.lark.test').closest('button')
    ).not.toBeDisabled();
    expect(
      screen.getByText('common.modify').closest('button')
    ).not.toBeDisabled();

    expect(screen.queryByText('system.lark.testSuccess')).toBeInTheDocument();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('system.lark.testSuccess')
    ).not.toBeInTheDocument();

    jest.clearAllMocks();
    testLarkConfigSpy.mockImplementation(() => {
      return resolveThreeSecond({
        is_message_sent_normally: false,
        error_message: 'error message',
      });
    });
    fireEvent.click(screen.getByText('system.lark.test'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('error message')).toBeInTheDocument();

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('error message')).not.toBeInTheDocument();
  });
});
