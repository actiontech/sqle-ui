import { fireEvent, render, screen, act } from '@testing-library/react';
import ModifyUserPassword from '.';
import user from '../../../../../api/user';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import { ModalName } from '../../../../../data/ModalName';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('User/ModifyUserPassword', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: { [ModalName.Update_User_Password]: true },
          selectUser: {
            user_name: 'root',
            email: 'user@123.com',
            role_name_list: ['role_name1'],
          },
        },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockUpdateOtherUserPasswordV1 = () => {
    const spy = jest.spyOn(user, 'UpdateOtherUserPasswordV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should match snapshot', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: { [ModalName.Update_User_Password]: false },
          selectUser: {
            user_name: 'root',
            email: 'user@123.com',
            role_name_list: ['role_name1'],
          },
        },
      })
    );
    const { baseElement, rerender } = render(<ModifyUserPassword />);
    expect(baseElement).toMatchSnapshot();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userManage: {
          modalStatus: { [ModalName.Update_User_Password]: true },
          selectUser: {
            user_name: 'root',
            email: 'user@123.com',
            role_name_list: ['role_name1'],
          },
        },
      })
    );
    rerender(<ModifyUserPassword />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should send modify password request when user input all fields', async () => {
    const updateSpy = mockUpdateOtherUserPasswordV1();
    render(<ModifyUserPassword />, undefined);

    fireEvent.input(screen.getByLabelText('user.userForm.password'), {
      target: { value: '222' },
    });
    fireEvent.input(screen.getByLabelText('user.userForm.passwordConfirm'), {
      target: { value: '222' },
    });
    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      password: '222',
      user_name: 'root',
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toHaveAttribute(
      'disabled'
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: { modalName: 'Update_User_Password', status: false },
      type: 'user/updateModalStatus',
    });
  });

  test('should reset all fields when user close modal', async () => {
    render(<ModifyUserPassword />);

    fireEvent.input(screen.getByLabelText('user.userForm.password'), {
      target: { value: '222' },
    });
    fireEvent.input(screen.getByLabelText('user.userForm.passwordConfirm'), {
      target: { value: '222' },
    });
    fireEvent.click(screen.getByText('common.close'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toBeCalledWith({
      payload: { modalName: 'Update_User_Password', status: false },
      type: 'user/updateModalStatus',
    });
    expect(screen.getByLabelText('user.userForm.password')).toHaveValue('');
    expect(screen.getByLabelText('user.userForm.passwordConfirm')).toHaveValue(
      ''
    );
  });
});
