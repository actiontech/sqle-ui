import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DingTalkSetting from '.';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

describe('test DingTalkSetting', () => {
  let getDingTalkConfigSpy: jest.SpyInstance;
  let updateDingTalkConfigSpy: jest.SpyInstance;
  beforeEach(() => {
    getDingTalkConfigSpy = mockGetDingTalkConfiguration();
    updateDingTalkConfigSpy = mockUpdateDingTalkConfiguration();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockGetDingTalkConfiguration = () => {
    const spy = jest.spyOn(configuration, 'getDingTalkConfigurationV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        app_key: 'app_key',
        app_secret: 'app_secret',
        is_enable_ding_talk_notify: false,
      })
    );
    return spy;
  };

  const mockUpdateDingTalkConfiguration = () => {
    const spy = jest.spyOn(configuration, 'updateDingTalkConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    const { container } = render(<DingTalkSetting />);
    expect(getDingTalkConfigSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.modify'));
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when open dingTalk configuration', async () => {
    getDingTalkConfigSpy.mockImplementation(() =>
      resolveThreeSecond({
        app_key: 'app_key',
        app_secret: 'app_secret',
        is_enable_ding_talk_notify: true,
      })
    );
    const { container } = render(<DingTalkSetting />);
    expect(getDingTalkConfigSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.modify'));
    expect(container).toMatchSnapshot();
  });

  test('should be able to update dingTalk configuration', async () => {
    render(<DingTalkSetting />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByText('common.modify'));
    fireEvent.click(screen.getByLabelText('system.dingTalk.enable'));
    fireEvent.change(screen.getByLabelText('AppKey'), {
      target: { value: 'update-appKey' },
    });
    fireEvent.change(screen.getByLabelText('AppSecret'), {
      target: { value: 'update-appSecret' },
    });
    expect(updateDingTalkConfigSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(updateDingTalkConfigSpy).toBeCalledTimes(1);
    expect(updateDingTalkConfigSpy).toBeCalledWith({
      is_enable_ding_talk_notify: true,
      app_key: 'update-appKey',
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
    expect(getDingTalkConfigSpy).toBeCalledTimes(2);
    expect(screen.getByText('common.modify')).toBeInTheDocument();
  });
});