import { fireEvent, render, waitFor } from '@testing-library/react';
import TableFilterForm from '.';
import { selectOptionByIndex } from '../../../../../testUtils/customQuery';
import { mockUseUserGroup } from '../../../../../testUtils/mockRequest';
import { act } from 'react-dom/test-utils';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';

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
    const { getByText } = render(
      <TableFilterForm updateTableFilter={updateTableFilter} />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    selectOptionByIndex(
      'userGroup.userGroupField.userGroupName',
      'user_group_name1'
    );
    fireEvent.click(getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(updateTableFilter).toBeCalledTimes(1);
    expect(updateTableFilter).toBeCalledWith({
      filter_user_group_name: 'user_group_name1',
    });
    fireEvent.click(getByText('common.reset'));
    fireEvent.click(getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(updateTableFilter).toBeCalledTimes(2);
    expect(updateTableFilter).nthCalledWith(2, {});
  });

  test('should refresh options when receive event form EventEmit', async () => {
    render(<TableFilterForm updateTableFilter={jest.fn()} />);
    expect(userGroupSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    expect(userGroupSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(300);
    });
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_User_Group_List);
    });
    expect(userGroupSpy).toBeCalledTimes(2);
  });
});
