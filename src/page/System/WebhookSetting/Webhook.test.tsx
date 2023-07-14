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

  it('should update webhook config after user input config form', async () => {
    const getConfigSpy = mockGetWebhookConfig();
    const updateSpy = mockUpdateWebhookConfig();
    const { container } = render(<Webhook />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.modify'));

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByTestId('enableButton'));

    fireEvent.input(screen.getByLabelText('Webhook url'), {
      target: { value: 'http://test.com' },
    });

    fireEvent.input(screen.getByLabelText('token'), {
      target: { value: 'test' },
    });

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      enable: true,
      token: 'test',
      max_retry_times: 3,
      retry_interval_seconds: 1,
      url: 'http://test.com',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(getConfigSpy).toBeCalledTimes(2);

    cleanup();
    updateSpy.mockClear();

    render(<Webhook />);
    fireEvent.click(screen.getByText('common.modify'));

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      enable: false,
    });
  });

  it('should send test request when user input receiver id and submit request', async () => {
    const getConfigSpy = () => {
      const spy = mockGetWebhookConfig();
      spy.mockImplementation(() =>
        resolveThreeSecond({
          enable: true,
          app_id: undefined,
          max_retry_times: undefined,
          retry_interval_seconds: undefined,
          url: '',
        })
      );
      return spy;
    };

    getConfigSpy();
    const testSpy = mockTestWebhook();
    render(<Webhook />);
    await act(async () => jest.advanceTimersByTime(3000));
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

    getConfigSpy();
    testSpy.mockImplementation(() =>
      resolveThreeSecond({
        send_error_message: 'error msg',
      })
    );

    render(<Webhook />);
    await act(async () => jest.advanceTimersByTime(3000));
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
