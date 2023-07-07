import { act } from '@testing-library/react';
import { mockGetProjectScore } from './mockApi';
import ProjectScore from '../ProjectScore';
import { panelCommonProps } from './index.data';
import { renderWithRedux } from '../../../../../testUtils/customRender';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';

describe('test ProjectScore', () => {
  let getProjectScoreSpy: jest.SpyInstance;
  beforeEach(() => {
    getProjectScoreSpy = mockGetProjectScore();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  test('should match snapshot', async () => {
    const { container } = renderWithRedux(
      <ProjectScore {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    expect(getProjectScoreSpy).toBeCalledTimes(1);
    expect(getProjectScoreSpy).toBeCalledWith({
      project_name: panelCommonProps.projectName,
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  test('should render error message', async () => {
    getProjectScoreSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ message: 'error message' })
    );

    const { container } = renderWithRedux(
      <ProjectScore {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
