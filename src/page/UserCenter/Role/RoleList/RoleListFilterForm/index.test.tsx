import {
  fireEvent,
  render,
  act as reactAct,
  screen,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import RoleListFilterForm from '.';
import EmitterKey from '../../../../../data/EmitterKey';
import { mockUseRole } from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';

describe('User/RoleList/RoleLIstFilterForm', () => {
  let roleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    roleSpy = mockUseRole();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    const { container } = render(
      <RoleListFilterForm updateRoleListFilter={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should get options from origin', async () => {
    render(<RoleListFilterForm updateRoleListFilter={jest.fn()} />);
    expect(roleSpy).toBeCalledTimes(1);
  });

  test('should refresh options when receive event from EventEmit', async () => {
    render(<RoleListFilterForm updateRoleListFilter={jest.fn()} />);
    expect(roleSpy).toBeCalledTimes(1);
    await reactAct(async () => jest.advanceTimersByTime(3000));

    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Role_list);
    });
    expect(roleSpy).toBeCalledTimes(2);
  });

  test('should call update filter info when user click reset button', async () => {
    const updateRoleListFilterMock = jest.fn();
    render(
      <RoleListFilterForm updateRoleListFilter={updateRoleListFilterMock} />
    );
    expect(roleSpy).toBeCalledTimes(1);
    await reactAct(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.reset'));
    expect(updateRoleListFilterMock).toBeCalledTimes(1);
    expect(updateRoleListFilterMock).toBeCalledWith({});
  });
});
