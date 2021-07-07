import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ModifyPasswordModal from '.';
import user from '../../../../api/user';
import { renderWithServerRouter } from '../../../../testUtils/customRender';
import { mockUseDispatch } from '../../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import { createMemoryHistory } from 'history';
import { ModalName } from '../../../../data/ModalName';

describe('Account/ModifyPassword', () => {
  let dispatchSpy: jest.Mock;
  beforeEach(() => {
    jest.useFakeTimers();
    const { scopeDispatch } = mockUseDispatch();
    dispatchSpy = scopeDispatch;
  });

  afterEach(() => {
    jest.useRealTimers();
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
    const history = createMemoryHistory();
    renderWithServerRouter(
      <ModifyPasswordModal visible={true} setModalStatus={jest.fn()} />,
      undefined,
      { history }
    );

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
    await waitFor(() => {
      jest.advanceTimersByTime(0);
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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(history.location.pathname).toBe('/login');
    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).nthCalledWith(1, {
      payload: {
        token: '',
      },
      type: 'user/updateToken',
    });
    expect(dispatchSpy).nthCalledWith(2, {
      payload: { role: '', username: '' },
      type: 'user/updateUser',
    });
  });

  test('should reset all fields when user close modal', async () => {
    const setModalStatusMock = jest.fn();
    render(
      <ModifyPasswordModal visible={true} setModalStatus={setModalStatusMock} />
    );

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
