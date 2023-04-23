import { act, fireEvent, render, screen } from '@testing-library/react';
import ModifyPasswordModal from '.';
import user from '../../../../api/user';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';

import { ModalName } from '../../../../data/ModalName';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useNavigate from '../../../../hooks/useNavigate';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('../../../../hooks/useNavigate', () => jest.fn());

describe('Account/ModifyPassword', () => {
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    useLocationMock.mockReturnValue({
      pathname: '/rule',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    useLocationMock.mockRestore();
  });

  const mockUpdateCurrentUserPasswordV1 = () => {
    const spy = jest.spyOn(user, 'UpdateCurrentUserPasswordV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    const { baseElement, rerender } = render(
      <ModifyPasswordModal visible={false} setModalStatus={jest.fn()} />
    );
    expect(baseElement).toMatchSnapshot();
    rerender(<ModifyPasswordModal visible={true} setModalStatus={jest.fn()} />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should send modify password request when user input all fields', async () => {
    const updateSpy = mockUpdateCurrentUserPasswordV1();
    render(<ModifyPasswordModal visible={true} setModalStatus={jest.fn()} />);

    await act(() => {
      fireEvent.input(
        screen.getByLabelText('account.modifyPassword.oldPassword'),
        { target: { value: '123' } }
      );
      fireEvent.input(
        screen.getByLabelText('account.modifyPassword.newPassword'),
        { target: { value: '222' } }
      );
      fireEvent.input(
        screen.getByLabelText('account.modifyPassword.newPasswordConfirm'),
        { target: { value: '222' } }
      );
      fireEvent.click(screen.getByText('common.submit'));
    });

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      new_password: '222',
      password: '123',
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.cancel').parentNode).toHaveAttribute(
      'disabled'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(1, '/login', { replace: true });

    expect(dispatchSpy).toBeCalledTimes(4);
    expect(dispatchSpy).nthCalledWith(1, {
      payload: { bindProjects: [] },
      type: 'user/updateBindProjects',
    });
    expect(dispatchSpy).nthCalledWith(2, {
      payload: { username: '', role: '' },
      type: 'user/updateUser',
    });
    expect(dispatchSpy).nthCalledWith(3, {
      payload: { token: '' },
      type: 'user/updateToken',
    });
    expect(dispatchSpy).nthCalledWith(4, {
      payload: { managementPermissions: [] },
      type: 'user/updateManagementPermissions',
    });
  });

  test('should reset all fields when user close modal', async () => {
    const setModalStatusMock = jest.fn();
    render(
      <ModifyPasswordModal visible={true} setModalStatus={setModalStatusMock} />
    );

    await act(() => {
      fireEvent.input(
        screen.getByLabelText('account.modifyPassword.oldPassword'),
        { target: { value: '123' } }
      );
      fireEvent.input(
        screen.getByLabelText('account.modifyPassword.newPassword'),
        { target: { value: '222' } }
      );
      fireEvent.input(
        screen.getByLabelText('account.modifyPassword.newPasswordConfirm'),
        { target: { value: '222' } }
      );
      fireEvent.click(screen.getByText('common.cancel'));
    });

    expect(setModalStatusMock).toBeCalledWith(ModalName.Modify_Password, false);
    expect(
      screen.getByLabelText('account.modifyPassword.oldPassword')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('account.modifyPassword.newPassword')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('account.modifyPassword.newPasswordConfirm')
    ).toHaveValue('');
  });
});
