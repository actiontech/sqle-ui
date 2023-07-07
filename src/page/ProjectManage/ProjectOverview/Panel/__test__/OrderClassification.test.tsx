/* eslint-disable no-console */
import { act } from '@testing-library/react';
import { mockStatisticWorkflowStatus } from './mockApi';
import OrderClassification from '../OrderClassification';
import { panelCommonProps } from './index.data';
import { renderWithRouterAndRedux } from '../../../../../testUtils/customRender';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';
import { getHrefByText } from '../../../../../testUtils/customQuery';

describe('test OrderClassification', () => {
  let statisticWorkflowStatusSpy: jest.SpyInstance;
  beforeEach(() => {
    statisticWorkflowStatusSpy = mockStatisticWorkflowStatus();
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
      <OrderClassification {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    expect(statisticWorkflowStatusSpy).toBeCalledTimes(1);
    expect(statisticWorkflowStatusSpy).toBeCalledWith({
      project_name: panelCommonProps.projectName,
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getHrefByText('order.createOrder.button')).toBe(
      `/project/${panelCommonProps.projectName}/order/create`
    );
    expect(container).toMatchSnapshot();
  });

  test('should render error message', async () => {
    statisticWorkflowStatusSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ message: 'error message' })
    );

    const { container } = renderWithRouterAndRedux(
      <OrderClassification {...panelCommonProps} />,
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
