import { act, fireEvent, render, screen } from '@testing-library/react';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import Oauth from './Oauth';
import { oauthConfig } from './__testData__';

describe('Oauth', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetOauthConfig();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const mockGetOauthConfig = () => {
    const spy = jest.spyOn(configuration, 'getOauth2ConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond(oauthConfig));
    return spy;
  };

  const mockUpdateOauthConfig = () => {
    const spy = jest.spyOn(configuration, 'updateOauth2ConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  it('should render oauth config after request finish', async () => {
    const { container } = render(<Oauth />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('should update oauth config after user input config form', async () => {
    const getConfigSpy = mockGetOauthConfig();
    const { container } = render(<Oauth />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.modify'));

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByLabelText('system.oauth.enable'));

    fireEvent.input(screen.getByLabelText('system.oauth.clientSecret'), {
      target: { value: '1234567' },
    });

    fireEvent.input(screen.getByLabelText('system.oauth.clientHost'), {
      target: { value: 'aaabbb' },
    });

    const updateSpy = mockUpdateOauthConfig();
    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      access_token_tag: 'rpYV2tN4&545Jvkd3%J6',
      client_host: 'aaabbb',
      client_id: '6lq#s#aRibpMvhp48ztHOg@sZ3PxA2e(MYdS!CJANzLPBdg]m)',
      client_key: '1234567',
      enable_oauth2: true,
      login_tip: 'VT[9[I$M(EW5R9o12*&Z',
      scopes: ['1XGCBu%brJrwjse@R^Ox', 'lpSLVoFnqZBfGHeI8023'],
      server_auth_url: 'prospero://tpmui.cf/timilp',
      server_token_url: 'mid://juckyny.na/xxsxnmf',
      server_user_id_url: 'cid://hqpbmxvbpl.cd/lcfyjtlkuj',
      user_id_tag: 'NFkVxY[4Xv^UFU&x&t5y',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(getConfigSpy).toBeCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('common.modify'));
    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSpy).toBeCalledTimes(2);
    expect(updateSpy).toBeCalledWith({
      enable_oauth2: false,
    });
  });
});
