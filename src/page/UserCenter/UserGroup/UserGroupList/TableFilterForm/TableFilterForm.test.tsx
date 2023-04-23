import { fireEvent, render, act } from '@testing-library/react';
import TableFilterForm from '.';
import { selectOptionByIndex } from '../../../../../testUtils/customQuery';
import { mockUseUserGroup } from '../../../../../testUtils/mockRequest';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { screen } from '@testing-library/react';

describe('TableFilterForm', () => {
  let userGroupSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    userGroupSpy = mockUseUserGroup();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should submit filter data when user click search button', async () => {
    const updateTableFilter = jest.fn();
    render(<TableFilterForm updateTableFilter={updateTableFilter} />);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex(
      'userGroup.userGroupField.userGroupName',
      'user_group_name1'
    );
    fireEvent.click(screen.getByText('common.search'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateTableFilter).toBeCalledTimes(1);
    expect(updateTableFilter).toBeCalledWith({
      filter_user_group_name: 'user_group_name1',
    });
    fireEvent.click(screen.getByText('common.reset'));
    fireEvent.click(screen.getByText('common.search'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateTableFilter).toBeCalledTimes(2);
    expect(updateTableFilter).nthCalledWith(2, {});
  });

  test('should refresh options when receive event form EventEmit', async () => {
    render(<TableFilterForm updateTableFilter={jest.fn()} />);
    expect(userGroupSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(userGroupSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(() => {
      EventEmitter.emit(EmitterKey.Refresh_User_Group_List);
    });
    expect(userGroupSpy).toBeCalledTimes(2);
  });
});
