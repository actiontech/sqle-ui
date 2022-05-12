import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import LdapConfig from '.';
import configuration from '../../../api/configuration';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

describe('System/LdapConfig', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetLdapConfig = () => {
    const spy = jest.spyOn(configuration, 'getLDAPConfigurationV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        enable_ldap: false,
        ldap_server_host: '1',
        ldap_server_port: '1',
        ldap_connect_dn: '1',
        ldap_search_base_dn: '1',
        ldap_user_name_rdn_key: '1',
        ldap_user_email_rdn_key: '1',
      })
    );
    return spy;
  };

  const mockUpdateldapConfig = () => {
    const spy = jest.spyOn(configuration, 'updateLDAPConfigurationV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should get ldap setting from origin', async () => {
    mockGetLdapConfig();
    const { container } = render(<LdapConfig />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should update ldap setting after user update from', async () => {
    const getSpy = mockGetLdapConfig();
    const updateSpy = mockUpdateldapConfig();
    const { container } = render(<LdapConfig />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('common.modify'));
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByLabelText('system.ldap.enableLdap'));
    fireEvent.input(screen.getByLabelText('system.ldap.ldapServerPort'), {
      target: { value: '3306' },
    });

    fireEvent.input(screen.getByLabelText('system.ldap.ldapConnectPwd'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      enable_ldap: true,
      ldap_connect_dn: '1',
      ldap_search_base_dn: '1',
      ldap_server_host: '1',
      ldap_server_port: '3306',
      ldap_connect_pwd: '123456',
      ldap_user_email_rdn_key: '1',
      ldap_user_name_rdn_key: '1',
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.cancel').parentNode).toHaveAttribute(
      'disabled'
    );
    expect(getSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getSpy).toBeCalledTimes(2);
    expect(container).toMatchSnapshot();
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
