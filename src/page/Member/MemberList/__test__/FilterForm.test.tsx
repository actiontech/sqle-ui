import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useParams } from 'react-router-dom';
import EmitterKey from '../../../../data/EmitterKey';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import {
  mockUseInstance,
  mockUseMember,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import MemberListFilterForm from '../FilterForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

describe('test MemberListFilterForm', () => {
  let useInstanceSpy: jest.SpyInstance;
  let useMemberSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const submitSpy = jest.fn();
  beforeEach(() => {
    useInstanceSpy = mockUseInstance();
    useMemberSpy = mockUseMember();
    useParamsMock.mockReturnValue({ projectName });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
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
    expect(useMemberSpy).toBeCalledTimes(0);
    render(<MemberListFilterForm submit={submitSpy} />);

    expect(useInstanceSpy).toBeCalledTimes(1);
    expect(useInstanceSpy).toBeCalledWith({
      project_name: projectName,
    });
    expect(useMemberSpy).toBeCalledTimes(1);
    expect(useMemberSpy).toBeCalledWith({
      project_name: projectName,
    });
  });

  test('should call username tips request when receive event form EventEmit', async () => {
    render(<MemberListFilterForm submit={submitSpy} />);
    expect(useMemberSpy).toBeCalledTimes(1);
    expect(useMemberSpy).toBeCalledWith({
      project_name: projectName,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Filter_User_Tips);
    });
    expect(useMemberSpy).toBeCalledTimes(2);
    expect(useMemberSpy).toBeCalledWith({
      project_name: projectName,
    });
  });

  test('should perform submission request when clicking a reset or search', async () => {
    render(<MemberListFilterForm submit={submitSpy} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(submitSpy).toBeCalledTimes(0);

    selectOptionByIndex('member.memberList.filterForm.username', 'member1');
    selectOptionByIndex('member.memberList.filterForm.instance', 'instance1');

    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(submitSpy).toBeCalledTimes(1);
    expect(submitSpy).toBeCalledWith({
      filterUserName: 'member1',
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
