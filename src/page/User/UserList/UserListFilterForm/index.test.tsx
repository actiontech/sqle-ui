import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import UserListFilterForm from '.';
import EmitterKey from '../../../../data/EmitterKey';
import {
  mockUseRole,
  mockUseUsername,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';

describe('User/UserList/UserLIstFilterForm', () => {
  let usernameSpy: jest.SpyInstance;
  let roleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    usernameSpy = mockUseUsername();
    roleSpy = mockUseRole();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    const { container } = render(
      <UserListFilterForm updateUserListFilter={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should get options from origin', async () => {
    render(<UserListFilterForm updateUserListFilter={jest.fn()} />);
    expect(usernameSpy).toBeCalledTimes(1);
    expect(roleSpy).toBeCalledTimes(1);
  });

  test('should refresh options when receive event from EventEmit', async () => {
    render(<UserListFilterForm updateUserListFilter={jest.fn()} />);
    expect(usernameSpy).toBeCalledTimes(1);
    expect(roleSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Role_list);
    });
    expect(usernameSpy).toBeCalledTimes(1);
    expect(roleSpy).toBeCalledTimes(2);
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_User_list);
    });
    expect(usernameSpy).toBeCalledTimes(2);
    expect(roleSpy).toBeCalledTimes(2);
  });

  test('should call update filter info when user click reset button', async () => {
    const updateRoleListFilterMock = jest.fn();
    render(
      <UserListFilterForm updateUserListFilter={updateRoleListFilterMock} />
    );
    expect(usernameSpy).toBeCalledTimes(1);
    expect(roleSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.click(screen.getByText('common.reset'));
    expect(updateRoleListFilterMock).toBeCalledTimes(1);
    expect(updateRoleListFilterMock).toBeCalledWith({});
  });
});
