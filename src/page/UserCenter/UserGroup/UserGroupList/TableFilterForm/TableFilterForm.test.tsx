import { fireEvent, render, waitFor } from '@testing-library/react';
import TableFilterForm from '.';
import { selectOptionByIndex } from '../../../../../testUtils/customQuery';
import { mockUseUserGroup } from '../../../../../testUtils/mockRequest';

describe('TableFilterForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseUserGroup();
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
});
