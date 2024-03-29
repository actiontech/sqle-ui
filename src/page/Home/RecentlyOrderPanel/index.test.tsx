import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import workflow from '../../../api/workflow';
import { renderWithRouter } from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import RecentlyOrderPanel from './index';

import moment from 'moment';
import { cloneDeep } from 'lodash';
import { translateTimeForRequest } from '../../../utils/Common';
import { ALL_PROJECT_NAME } from '..';
import { getHrefByText } from '../../../testUtils/customQuery';

describe('test home/RecentlyOrderPanel', () => {
  const list = [
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
  const mockRequest = () => {
    const spy = jest.spyOn(workflow, 'getGlobalWorkflowsV1');
    spy.mockImplementation(() => resolveThreeSecond(list));
    return spy;
  };
  let getMockRequestSpy: jest.SpyInstance;
  const realDateNow = Date.now.bind(global.Date);
  const projectName = ALL_PROJECT_NAME;

  beforeEach(() => {
    const dateNowStub = jest.fn(() => new Date('2022-07-21T12:33:37.000Z'));
    global.Date.now = dateNowStub as any;
    jest.useFakeTimers();
    getMockRequestSpy = mockRequest();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    global.Date.now = realDateNow;
    cleanup();
  });

  test('should match snapshot', () => {
    const { container } = renderWithRouter(
      <RecentlyOrderPanel projectName={projectName} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should be called getWorkflowsV2 interface', async () => {
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithRouter(<RecentlyOrderPanel projectName={projectName} />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMockRequestSpy).toBeCalledTimes(1);
  });

  test('should execute corresponding event when clicking button', async () => {
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithRouter(<RecentlyOrderPanel projectName={projectName} />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getMockRequestSpy).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId('refreshTable'));
    await act(async () => jest.advanceTimersByTime(0));

    const endTime = moment();
    const startTime = cloneDeep(endTime).subtract(1, 'day');
    expect(getMockRequestSpy).toBeCalledTimes(2);
    expect(getMockRequestSpy).toBeCalledWith({
      page_index: 1,
      page_size: 1000,
      filter_task_execute_start_time_from: translateTimeForRequest(startTime),
      filter_task_execute_start_time_to: translateTimeForRequest(endTime),
      project_name: '',
    });
  });

  test('should jump to the order page under the project when click on the corresponding link', async () => {
    renderWithRouter(<RecentlyOrderPanel projectName={projectName} />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText(list[0].workflow_name!)).toBeInTheDocument();
    expect(getHrefByText(list[0].workflow_name!)).toBe(
      `/project/${list[0].project_name}/order/${list[0].workflow_id}`
    );
    expect(screen.getByText(list[0].project_name!)).toBeInTheDocument();
    expect(getHrefByText(list[0].project_name!)).toBe(
      `/project/${list[0].project_name}/overview`
    );
  });

  test('should be called getWorkflowsV1 when project name is not empty', async () => {
    const getMockRequestSpy = jest.spyOn(workflow, 'getWorkflowsV1');
    getMockRequestSpy.mockImplementation(() => resolveThreeSecond(list));

    renderWithRouter(<RecentlyOrderPanel projectName={'default'} />);

    expect(getMockRequestSpy).toBeCalledTimes(1);

    const endTime = moment();
    const startTime = cloneDeep(endTime).subtract(1, 'day');
    expect(getMockRequestSpy).toBeCalledWith({
      page_index: 1,
      page_size: 1000,
      filter_task_execute_start_time_from: translateTimeForRequest(startTime),
      filter_task_execute_start_time_to: translateTimeForRequest(endTime),
      project_name: 'default',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByTestId('refreshTable'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getMockRequestSpy).toBeCalledTimes(2);
  });
});
