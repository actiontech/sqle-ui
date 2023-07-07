/* eslint-disable no-console */
import { act } from '@testing-library/react';
import { mockGetInstanceHealth } from './mockApi';
import DataSourceCount, {
  legendFormatter,
  tooltipCustomContent,
} from '../DataSourceCount';
import { panelCommonProps } from './index.data';
import { renderWithRouterAndRedux } from '../../../../../testUtils/customRender';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';
import { getHrefByText } from '../../../../../testUtils/customQuery';

describe('test DataSourceCount', () => {
  let getInstanceHealthSpy: jest.SpyInstance;
  beforeEach(() => {
    getInstanceHealthSpy = mockGetInstanceHealth();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  const error = console.error;

  beforeAll(() => {
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });
  });

  afterAll(() => {
    console.error = error;
  });
  test('should match snapshot', async () => {
    const { container } = renderWithRouterAndRedux(
      <DataSourceCount {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    expect(getInstanceHealthSpy).toBeCalledTimes(1);
    expect(getInstanceHealthSpy).toBeCalledWith({
      project_name: panelCommonProps.projectName,
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getHrefByText('common.showMore')).toBe(
      `/project/${panelCommonProps.projectName}/data`
    );
    expect(container).toMatchSnapshot();
  });

  test('should render error message', async () => {
    getInstanceHealthSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ message: 'error message' })
    );

    const { container } = renderWithRouterAndRedux(
      <DataSourceCount {...panelCommonProps} />,
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

  test('legendFormatter and tooltipCustomContent', () => {
    expect(legendFormatter('health')).toMatchSnapshot();
    expect(legendFormatter('risk')).toMatchSnapshot();

    expect(
      tooltipCustomContent('MySQL', [
        {
          data: {
            value: 10,
            category: 'risk',
            names: 'a、b',
          },
          color: '#fbd44d',
        },
      ])
    ).toMatchSnapshot();
  });
});
