/* eslint-disable no-console */
import { act, screen } from '@testing-library/react';
import { renderWithRouterAndRedux } from '../../../../../testUtils/customRender';
import AuditPlanRisk from '../AuditPlanRisk';
import { panelCommonProps } from './index.data';
import { mockGetRiskAuditPlan } from './mockApi';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';
import { getHrefByText } from '../../../../../testUtils/customQuery';

describe('test AuditPlanRisk', () => {
  let getRiskAuditPlanSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getRiskAuditPlanSpy = mockGetRiskAuditPlan();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { container } = renderWithRouterAndRedux(
      <AuditPlanRisk
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

    expect(getRiskAuditPlanSpy).toBeCalledTimes(1);
    expect(getRiskAuditPlanSpy).toBeCalledWith({
      project_name: panelCommonProps.projectName,
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(getHrefByText('common.showMore')).toBe(
      `/project/${panelCommonProps.projectName}/auditPlan`
    );
    expect(getHrefByText('name')).toBe(
      `/project/${panelCommonProps.projectName}/auditPlan/detail/name`
    );
    expect(screen.getByTestId('report-time').getAttribute('href')).toBe(
      `/project/${panelCommonProps.projectName}/auditPlan/detail/name/report/1`
    );
  });

  test('should render error message', async () => {
    getRiskAuditPlanSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ message: 'error message' })
    );

    const { container } = renderWithRouterAndRedux(
      <AuditPlanRisk
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
