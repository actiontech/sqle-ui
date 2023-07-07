/* eslint-disable no-console */
import { act } from '@testing-library/react';
import { renderWithRouterAndRedux } from '../../../../../testUtils/customRender';
import OrderRisk from '../OrderRisk';
import { panelCommonProps } from './index.data';
import { mockStatisticRiskWorkflow } from './mockApi';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';
import { getHrefByText } from '../../../../../testUtils/customQuery';

describe('test OrderRisk', () => {
  let statisticRiskWorkflowSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    statisticRiskWorkflowSpy = mockStatisticRiskWorkflow();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithRouterAndRedux(
      <OrderRisk
        projectName={panelCommonProps.projectName}
        commonPadding={panelCommonProps.commonPadding}
      />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );

    expect(statisticRiskWorkflowSpy).toBeCalledTimes(1);
    expect(statisticRiskWorkflowSpy).toBeCalledWith({
      project_name: panelCommonProps.projectName,
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(getHrefByText('common.showMore')).toBe(
      `/project/${panelCommonProps.projectName}/order`
    );
    expect(getHrefByText('test')).toBe(
      `/project/${panelCommonProps.projectName}/order/123`
    );
  });

  test('should render error message', async () => {
    statisticRiskWorkflowSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ message: 'error message' })
    );

    const { container } = renderWithRouterAndRedux(
      <OrderRisk
        projectName={panelCommonProps.projectName}
        commonPadding={panelCommonProps.commonPadding}
      />,
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
