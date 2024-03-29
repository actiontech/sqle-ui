import {
  fireEvent,
  render,
  screen,
  act,
  cleanup,
} from '@testing-library/react';
import LarkSetting from './LarkSetting';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { TestFeishuConfigurationReqV1AccountTypeEnum } from '../../../api/common.enum';

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
    cleanup();
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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.modify'));
    expect(container).toMatchSnapshot();
  });

  test('should disabled edit lark configuration when "is_feishu_notification_enabled" is equal false', async () => {
    getLarkConfigSpy.mockImplementation(() =>
      resolveThreeSecond({
        app_id: 'app_key',
        is_feishu_notification_enabled: false,
      })
    );
    const { container } = render(<LarkSetting />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.modify'));
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByLabelText('system.lark.enable'));
    expect(container).toMatchSnapshot();
  });

  test('should be able to update dingTalk configuration', async () => {
    render(<LarkSetting />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.modify'));
    fireEvent.click(screen.getByLabelText('system.lark.enable'));
    expect(screen.queryByLabelText('App ID')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('App Secret')).not.toBeInTheDocument();

    expect(updateLarkConfigSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateLarkConfigSpy).toBeCalledTimes(1);
    expect(updateLarkConfigSpy).toBeCalledWith({
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

    expect(getLarkConfigSpy).toBeCalledTimes(2);
    expect(screen.getByText('common.modify')).toBeInTheDocument();
  });

  test('should send request when clicking test DingTalk button', async () => {
    const { baseElement } = render(<LarkSetting />);
    expect(testLarkConfigSpy).toBeCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('system.lark.test'));

    expect(screen.getByText('system.lark.receiveType')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.change(screen.getAllByLabelText('system.lark.email')[1], {
      target: { value: 'demo@gmail.com' },
    });

    fireEvent.click(screen.getByText('common.ok'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(testLarkConfigSpy).toBeCalledTimes(1);
    expect(testLarkConfigSpy).nthCalledWith(1, {
      account: 'demo@gmail.com',
      account_type: TestFeishuConfigurationReqV1AccountTypeEnum.email,
    });

    expect(screen.getByText('system.lark.testing')).toBeInTheDocument();
    expect(
      screen.getByText('system.lark.test').closest('button')
    ).not.toBeDisabled();

    expect(
      screen.getByText('common.modify').closest('button')
    ).not.toBeDisabled();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('system.lark.testing')).not.toBeInTheDocument();
    expect(
      screen.getByText('system.lark.test').closest('button')
    ).not.toBeDisabled();
    expect(
      screen.getByText('common.modify').closest('button')
    ).not.toBeDisabled();

    expect(screen.getByText('system.lark.testSuccess')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('system.lark.testSuccess')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByText('system.lark.phone')[0]);
    fireEvent.change(screen.getAllByLabelText('system.lark.phone')[1], {
      target: { value: '13112341234' },
    });

    fireEvent.click(screen.getByText('common.ok'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(testLarkConfigSpy).toBeCalledTimes(2);
    expect(testLarkConfigSpy).nthCalledWith(2, {
      account: '13112341234',
      account_type: TestFeishuConfigurationReqV1AccountTypeEnum.phone,
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    jest.clearAllMocks();
    testLarkConfigSpy.mockImplementation(() => {
      return resolveThreeSecond({
        is_message_sent_normally: false,
        error_message: 'error message',
      });
    });
    fireEvent.click(screen.getByText('system.lark.test'));
    fireEvent.change(screen.getAllByLabelText('system.lark.email')[1], {
      target: { value: 'demo@gmail.com' },
    });

    fireEvent.click(screen.getByText('common.ok'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(testLarkConfigSpy).toBeCalledTimes(1);
    expect(testLarkConfigSpy).nthCalledWith(1, {
      account: 'demo@gmail.com',
      account_type: TestFeishuConfigurationReqV1AccountTypeEnum.email,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('error message')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('error message')).not.toBeInTheDocument();
  });

  test('should be disabled test button when config switch is off', async () => {
    getLarkConfigSpy.mockImplementation(() =>
      resolveThreeSecond({
        app_id: 'app_id',
        is_feishu_notification_enabled: false,
      })
    );
    render(<LarkSetting />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('system.lark.test').closest('button')
    ).toBeDisabled();

    fireEvent.click(screen.getByText('system.lark.test'));

    expect(
      screen.queryByText('system.lark.receiveType')
    ).not.toBeInTheDocument();
  });
});
