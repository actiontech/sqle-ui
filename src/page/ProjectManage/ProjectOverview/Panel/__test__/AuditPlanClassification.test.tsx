/* eslint-disable no-console */
import { act } from '@testing-library/react';
import { mockStatisticAuditPlan } from './mockApi';
import AuditPlanClassification from '../AuditPlanClassification';
import { panelCommonProps } from './index.data';
import { renderWithRouterAndRedux } from '../../../../../testUtils/customRender';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';
import { getHrefByText } from '../../../../../testUtils/customQuery';

describe('test AuditPlanClassification', () => {
  let statisticAuditPlanSpy: jest.SpyInstance;
  beforeEach(() => {
    statisticAuditPlanSpy = mockStatisticAuditPlan();
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
      <AuditPlanClassification {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    expect(statisticAuditPlanSpy).toBeCalledTimes(1);
    expect(statisticAuditPlanSpy).toBeCalledWith({
      project_name: panelCommonProps.projectName,
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getHrefByText('auditPlan.action.create')).toBe(
      `/project/${panelCommonProps.projectName}/auditPlan/create`
    );
    expect(container).toMatchSnapshot();
  });

  test('should render error message', async () => {
    statisticAuditPlanSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ message: 'error message' })
    );

    const { container } = renderWithRouterAndRedux(
      <AuditPlanClassification {...panelCommonProps} />,
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
