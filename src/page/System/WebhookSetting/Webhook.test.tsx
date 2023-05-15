import {
  fireEvent,
  render,
  screen,
  act,
  cleanup,
} from '@testing-library/react';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import Webhook from './Webhook';

describe('webhook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetWebhookConfig();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const mockGetWebhookConfig = () => {
    const spy = jest.spyOn(configuration, 'getGlobalWorkflowWebHookConfig');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        enable: false,
        app_id: undefined,
        max_retry_times: undefined,
        retry_interval_seconds: undefined,
        url: '',
      })
    );
    return spy;
  };

  const mockUpdateWebhookConfig = () => {
    const spy = jest.spyOn(configuration, 'updateGlobalWebHookConfig');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockTestWebhook = () => {
    const spy = jest.spyOn(configuration, 'testGlobalWorkflowWebHookConfig');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  it('should render webhook config after request finish', async () => {
    const { container } = render(<Webhook />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('should update wechat config after user input config form', async () => {
    const getConfigSpy = mockGetWebhookConfig();
    const { container } = render(<Webhook />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.modify'));

    expect(container).toMatchSnapshot();

    fireEvent.click(
      screen.getByLabelText('system.webhook.enableWebhookNotify')
    );

    fireEvent.input(screen.getByLabelText('Webhook url'), {
      target: { value: 'http://test.com' },
    });

    fireEvent.input(screen.getByLabelText('App Secret'), {
      target: { value: 'test' },
    });

    const updateSpy = mockUpdateWebhookConfig();
    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      enable: true,
      app_id: 'sqle',
      app_secret: 'test',
      max_retry_times: 3,
      retry_interval_seconds: 1,
      url: 'http://test.com',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(getConfigSpy).toBeCalledTimes(2);
  });

  it('should send test request when user input receiver id and submit request', async () => {
    const testSpy = mockTestWebhook();
    render(<Webhook />);
    fireEvent.click(screen.getByText('system.webhook.test'));

    expect(testSpy).toBeCalledTimes(1);
    expect(screen.getByText('system.webhook.testing')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('system.webhook.testing')
    ).not.toBeInTheDocument();
    expect(screen.getByText('system.webhook.testSuccess')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('system.webhook.testSuccess')
    ).not.toBeInTheDocument();

    cleanup();

    testSpy.mockImplementation(() =>
      resolveThreeSecond({
        send_error_message: 'error msg',
      })
    );

    render(<Webhook />);
    fireEvent.click(screen.getByText('system.webhook.test'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('system.webhook.testSuccess')
    ).not.toBeInTheDocument();
    expect(screen.getByText('error msg')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('error msg')).not.toBeInTheDocument();
  });
});
