import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useLocation } from 'react-router-dom';
import EmitterKey from '../../../../data/EmitterKey';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import {
  mockUseInstance,
  mockUseUsername,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import MemberListFilterForm from '../FilterForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
const projectName = 'test';

describe('test MemberListFilterForm', () => {
  let useInstanceSpy: jest.SpyInstance;
  let useUsernameSpy: jest.SpyInstance;
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  const submitSpy = jest.fn();
  beforeEach(() => {
    useInstanceSpy = mockUseInstance();
    useUsernameSpy = mockUseUsername();
    useLocationMock.mockImplementation(() => {
      return { state: { projectName } };
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    useLocationMock.mockRestore();
  });
  test('should match snapshot', async () => {
    const { container } = render(<MemberListFilterForm submit={submitSpy} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should get data from request', () => {
    expect(useInstanceSpy).toBeCalledTimes(0);
    expect(useUsernameSpy).toBeCalledTimes(0);
    render(<MemberListFilterForm submit={submitSpy} />);

    expect(useInstanceSpy).toBeCalledTimes(1);
    expect(useUsernameSpy).toBeCalledTimes(1);
    expect(useUsernameSpy).toBeCalledWith({
      filter_project: projectName,
    });
  });

  test('should call username tips request when receive event form EventEmit', async () => {
    render(<MemberListFilterForm submit={submitSpy} />);
    expect(useUsernameSpy).toBeCalledTimes(1);
    expect(useUsernameSpy).toBeCalledWith({
      filter_project: projectName,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Filter_User_Tips);
    });
    expect(useUsernameSpy).toBeCalledTimes(2);
    expect(useUsernameSpy).toBeCalledWith({
      filter_project: projectName,
    });
  });

  test('should perform submission request when clicking a reset or search', async () => {
    render(<MemberListFilterForm submit={submitSpy} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(submitSpy).toBeCalledTimes(0);

    selectOptionByIndex('member.memberList.filterForm.username', 'user_name1');
    selectOptionByIndex('member.memberList.filterForm.instance', 'instance1');

    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(submitSpy).toBeCalledTimes(1);
    expect(submitSpy).toBeCalledWith({
      filterUserName: 'user_name1',
      filterInstance: 'instance1',
    });
    fireEvent.click(screen.getByText('common.reset'));
    expect(
      screen.getByLabelText('member.memberList.filterForm.username')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('member.memberList.filterForm.instance')
    ).toHaveValue('');
    expect(submitSpy).toBeCalledTimes(2);
    expect(submitSpy).toBeCalledWith({});
  });
});
