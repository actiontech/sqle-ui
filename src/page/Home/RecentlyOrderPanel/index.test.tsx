import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import workflow from '../../../api/workflow';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import RecentlyOrderPanel from './index';
import { createMemoryHistory } from 'history';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { translateTimeForRequest } from '../../../utils/Common';
import { OrderListUrlParamsKey } from '../../Order/List/index.data';

describe('test home/RecentlyOrderPanel', () => {
  const mockRequest = () => {
    const spy = jest.spyOn(workflow, 'getWorkflowListV1');
    spy.mockImplementation(() =>
      resolveThreeSecond([
        {
          create_time: '2021-04-29T05:41:24Z',
          create_user_name: 'admin',
          current_step_assignee_user_name_list: ['admin'],
          current_step_type: 'sql_execute',
          desc: '',
          status: 'on_process',
          subject: 'order123',
          task_instance_name: 'db1',
          task_instance_schema: '',
          task_pass_rate: 0,
          task_status: 'audited',
          workflow_id: 1,
          task_score: 30,
        },
      ])
    );
    return spy;
  };
  let getMockRequestSpy: jest.SpyInstance;
  const realDateNow = Date.now.bind(global.Date);

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
    const { container } = renderWithRouter(<RecentlyOrderPanel />);
    expect(container).toMatchSnapshot();
  });

  test('should be called getWorkflowListV1 interface', async () => {
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithRouter(<RecentlyOrderPanel />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(1);
  });

  test('should execute corresponding event when clicking button', async () => {
    const history = createMemoryHistory();
    expect(getMockRequestSpy).toBeCalledTimes(0);
    renderWithServerRouter(<RecentlyOrderPanel />, undefined, { history });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMockRequestSpy).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId('refreshTable'));

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    const endTime = moment();
    const startTime = cloneDeep(endTime).subtract(1, 'day');
    expect(getMockRequestSpy).toBeCalledTimes(2);
    expect(getMockRequestSpy).toBeCalledWith({
      page_index: 1,
      page_size: 1000,
      filter_task_execute_start_time_from: translateTimeForRequest(startTime),
      filter_task_execute_start_time_to: translateTimeForRequest(endTime),
    });
    const format = (time: moment.Moment) => {
      return time.format('YYYY-MM-DD HH:mm:ss');
    };

    fireEvent.click(screen.getByText('common.more'));
    expect(history.location.pathname).toBe(`/order`);
    expect(history.location.search).toBe(
      `?${OrderListUrlParamsKey.executeTimeForm}=${format(startTime)}&${
        OrderListUrlParamsKey.executeTimeTo
      }=${format(endTime)}`
    );
  });
});
