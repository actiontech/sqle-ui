import { render, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';
import ProjectInfoBox from '../ProjectInfoBox';
import { mockGetProjectDetail } from './utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('test ProjectInfoBox', () => {
  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  let getProjectDetailSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getProjectDetailSpy = mockGetProjectDetail();
    useLocationMock.mockImplementation(() => {
      return { state: { projectName: 'test' } };
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    expect(getProjectDetailSpy).toBeCalledTimes(0);
    const { container } = render(<ProjectInfoBox />);
    expect(getProjectDetailSpy).toBeCalledTimes(1);
    expect(getProjectDetailSpy).toBeCalledWith({
      project_name: 'test',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when a request goes wrong', async () => {
    getProjectDetailSpy.mockImplementation(() => resolveErrorThreeSecond({}));
    expect(getProjectDetailSpy).toBeCalledTimes(0);

    const { container } = render(<ProjectInfoBox />);
    expect(getProjectDetailSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
