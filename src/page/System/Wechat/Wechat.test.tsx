import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import Wechat from './Wechat';

describe('wechat', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetWechatConfig();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const mockGetWechatConfig = () => {
    const spy = jest.spyOn(configuration, 'getWeChatConfigurationV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        enable_wechat_notify: false,
        corp_id: '123123123',
        agent_id: 12312312312122,
        safe_enabled: false,
        proxy_ip: '1.1.1.1',
      })
    );
    return spy;
  };

  const mockUpdateWechatConfig = () => {
    const spy = jest.spyOn(configuration, 'updateWeChatConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockTestWechat = () => {
    const spy = jest.spyOn(configuration, 'testWeChatConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  it('should render wechat config after request finish', async () => {
    const { container } = render(<Wechat />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  it('should update wechat config after user input config form', async () => {
    const getConfigSpy = mockGetWechatConfig();
    const { container } = render(<Wechat />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('common.modify'));

    expect(container).toMatchSnapshot();

    fireEvent.click(
      screen.getByLabelText('system.wechat.enable_wechat_notify')
    );

    fireEvent.input(screen.getByLabelText('system.wechat.agent_id'), {
      target: { value: '1234567' },
    });

    fireEvent.input(screen.getByLabelText('system.wechat.corp_secret'), {
      target: { value: 'aaabbb' },
    });

    const updateSpy = mockUpdateWechatConfig();
    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(container).toMatchSnapshot();

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      agent_id: 1234567,
      corp_id: '123123123',
      corp_secret: 'aaabbb',
      enable_wechat_notify: true,
      proxy_ip: '1.1.1.1',
      safe_enabled: false,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
    expect(getConfigSpy).toBeCalledTimes(2);
  });

  it('should send test request when user input receiver id and submit request', async () => {
    const testSpy = mockTestWechat();
    const { baseElement } = render(<Wechat />);
    fireEvent.click(screen.getByText('system.wechat.test'));
    expect(baseElement).toMatchSnapshot();

    fireEvent.input(screen.getByTestId('receivername'), {
      target: { value: 'test' },
    });

    fireEvent.click(screen.getByText('common.ok'));

    expect(testSpy).toBeCalledTimes(1);
    expect(testSpy).toBeCalledWith({ recipient_id: 'test' });
    expect(screen.queryByText('system.wechat.testing')).toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryByText('system.wechat.testing')).not.toBeInTheDocument();
    expect(screen.queryByText('system.wechat.testSuccess')).toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('system.wechat.testSuccess')
    ).not.toBeInTheDocument();
  });
});
