import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import workflow from '../../../api/workflow';
import { getGlobalWorkflowsV1FilterStatusEnum } from '../../../api/workflow/index.enum';
import { renderWithRouter } from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '../CommonTable';
import DEVPanel from './index';

import { ALL_PROJECT_NAME } from '..';
import { useSelector } from 'react-redux';

const resList = [
  {
    create_time: '2021-04-29T05:41:24Z',
    create_user_name: 'admin',
    current_step_assignee_user_name_list: ['admin'],
    current_step_type: 'sql_execute',
    desc: '',
    status: 'wait_for_audit',
    workflow_name: 'order123',
    project_name: 'default',
    workflow_id: '1',
  },
];

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  };
});

describe('test home/DEVPanel', () => {
  const mockRequest = () => {
    const spy = jest.spyOn(workflow, 'getGlobalWorkflowsV1');
    spy.mockImplementation(() => resolveThreeSecond(resList));
    return spy;
  };

  let getMockRequestSpy: jest.SpyInstance;
  const username = 'admin';
  const mockGetWorkflowStatistics = jest.fn();
  const projectName = ALL_PROJECT_NAME;

  beforeEach(() => {
    jest.useFakeTimers();
    getMockRequestSpy = mockRequest();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { username },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  test('should match snapshot', () => {
    const { container } = renderWithRouter(
      <DEVPanel
        getWorkflowStatistics={mockGetWorkflowStatistics}
        projectName={projectName}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('should be called getWorkflowsV2 interface', async () => {
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithRouter(
      <DEVPanel
        getWorkflowStatistics={mockGetWorkflowStatistics}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMockRequestSpy).toBeCalledTimes(3);
  });

  test('should switch tab when clicking another tab title', async () => {
    renderWithRouter(
      <DEVPanel
        getWorkflowStatistics={mockGetWorkflowStatistics}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('dashboard.myOrderSituation.pendingReviewByMe')
        .parentNode
    ).toHaveClass('ant-tabs-tab-active');
    expect(
      screen.getByText('dashboard.myOrderSituation.pendingExecByMe').parentNode
    ).not.toHaveClass('ant-tabs-tab-active');
    expect(
      screen.getByText('dashboard.myOrderSituation.rejectedOrderByMe')
        .parentNode
    ).not.toHaveClass('ant-tabs-tab-active');

    fireEvent.click(
      screen.getByText('dashboard.myOrderSituation.pendingExecByMe')
    );
    expect(
      screen.getByText('dashboard.myOrderSituation.pendingExecByMe').parentNode
    ).toHaveClass('ant-tabs-tab-active');

    fireEvent.click(
      screen.getByText('dashboard.myOrderSituation.rejectedOrderByMe')
    );
    expect(
      screen.getByText('dashboard.myOrderSituation.rejectedOrderByMe')
        .parentNode
    ).toHaveClass('ant-tabs-tab-active');
  });

  test('should be execute correspond event on the current tab', async () => {
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithRouter(
      <DEVPanel
        getWorkflowStatistics={mockGetWorkflowStatistics}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMockRequestSpy).toBeCalledTimes(3);
    expect(mockGetWorkflowStatistics).toBeCalledTimes(0);

    expect(
      screen.getByText('dashboard.myOrderSituation.pendingReviewByMe')
        .parentNode
    ).toHaveClass('ant-tabs-tab-active');

    fireEvent.click(screen.getByTestId('refreshTable'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockGetWorkflowStatistics).toBeCalledTimes(1);
    expect(getMockRequestSpy).toBeCalledTimes(6);
    expect(getMockRequestSpy.mock.calls[3][0]).toEqual({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_create_user_name: username,
      filter_status: 'wait_for_execution',
      project_name: '',
    });
    expect(getMockRequestSpy.mock.calls[4][0]).toEqual({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_create_user_name: username,
      filter_status: 'wait_for_audit',
      project_name: '',
    });
    expect(getMockRequestSpy.mock.calls[5][0]).toEqual({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_create_user_name: username,
      filter_status: getGlobalWorkflowsV1FilterStatusEnum.rejected,
      project_name: '',
    });

    fireEvent.click(
      screen.getByText('dashboard.myOrderSituation.pendingExecByMe')
    );
    fireEvent.click(screen.getByTestId('refreshTable'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMockRequestSpy).toBeCalledTimes(9);
    expect(mockGetWorkflowStatistics).toBeCalledTimes(2);

    fireEvent.click(
      screen.getByText('dashboard.myOrderSituation.rejectedOrderByMe')
    );
    fireEvent.click(screen.getByTestId('refreshTable'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMockRequestSpy).toBeCalledTimes(12);
    expect(mockGetWorkflowStatistics).toBeCalledTimes(3);
  });

  test('should be called getWorkflowsV1 when project name is not empty', async () => {
    const getMockRequestSpy = jest.spyOn(workflow, 'getWorkflowsV1');
    getMockRequestSpy.mockImplementation(() => resolveThreeSecond(resList));

    renderWithRouter(
      <DEVPanel
        getWorkflowStatistics={mockGetWorkflowStatistics}
        projectName="default"
      />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMockRequestSpy).toBeCalledTimes(3);
    expect(getMockRequestSpy).toBeCalledWith({
      filter_create_user_name: 'admin',
      filter_status: 'wait_for_execution',
      page_index: 1,
      page_size: 5,
      project_name: 'default',
    });
    expect(getMockRequestSpy).toBeCalledWith({
      filter_create_user_name: 'admin',
      filter_status: 'wait_for_audit',
      page_index: 1,
      page_size: 5,
      project_name: 'default',
    });
    expect(getMockRequestSpy).toBeCalledWith({
      filter_create_user_name: 'admin',
      filter_status: 'rejected',
      page_index: 1,
      page_size: 5,
      project_name: 'default',
    });

    fireEvent.click(screen.getByTestId('refreshTable'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMockRequestSpy).toBeCalledTimes(6);
  });
});
