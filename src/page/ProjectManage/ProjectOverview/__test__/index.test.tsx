import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import ProjectOverview from '..';
import { resolveErrorThreeSecond } from '../../../../testUtils/mockRequest';
import {
  mockGetProjectDetail,
  mockGetProjectStatistics,
} from '../../__test__/utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

describe('test ProjectOverview', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getProjectDetailSpy: jest.SpyInstance;
  let getProjectStatistics: jest.SpyInstance;
  beforeEach(() => {
    getProjectDetailSpy = mockGetProjectDetail();
    getProjectStatistics = mockGetProjectStatistics();

    useParamsMock.mockReturnValue({ projectName });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  test('should match snapshot', async () => {
    const { container } = render(<ProjectOverview />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when get project statistics is wrong', async () => {
    getProjectStatistics.mockImplementation(() =>
      resolveErrorThreeSecond(undefined)
    );

    const { container } = render(<ProjectOverview />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();
  });

  test('should refresh project detail info and statistics info when clicking refresh button', async () => {
    expect(getProjectDetailSpy).toBeCalledTimes(0);
    expect(getProjectStatistics).toBeCalledTimes(0);
    render(<ProjectOverview />);
    expect(getProjectDetailSpy).toBeCalledTimes(1);
    expect(getProjectDetailSpy).toBeCalledWith({
      project_name: projectName,
    });
    expect(getProjectStatistics).toBeCalledTimes(1);
    expect(getProjectStatistics).toBeCalledWith({
      project_name: projectName,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByTestId('refresh-project-info'));
    expect(getProjectDetailSpy).toBeCalledTimes(2);
    expect(getProjectDetailSpy).toBeCalledWith({
      project_name: projectName,
    });
    expect(getProjectStatistics).toBeCalledTimes(2);
    expect(getProjectStatistics).toBeCalledWith({
      project_name: projectName,
    });
  });
});