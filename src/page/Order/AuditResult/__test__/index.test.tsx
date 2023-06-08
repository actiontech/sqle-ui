import { act, fireEvent, render, screen } from '@testing-library/react';
import AuditResult from '..';
import task from '../../../../api/task';
import {
  getAllBySelector,
  getBySelector,
} from '../../../../testUtils/customQuery';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';
import { mockGetAllRules } from '../../../Rule/__test__/utils';
import { taskSqls } from '../../Detail/__testData__';
import { mockUseStyle } from '../../../../testUtils/mockStyle';

describe('Order/Detail/AuditResult', () => {
  const projectName = 'default';
  let getAllRulesSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseStyle();
    jest.useFakeTimers();
    getAllRulesSpy = mockGetAllRules();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  const mockGetTaskSqls = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV2');
    spy.mockImplementation(() =>
      resolveThreeSecond(taskSqls, { otherData: { total_nums: 20 } })
    );
    return spy;
  };

  const mockUpdateTaskSqlDesc = () => {
    const spy = jest.spyOn(task, 'updateAuditTaskSQLsV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should get task sql info when pass task id into component props', async () => {
    const getTaskSqlSpy = mockGetTaskSqls();
    const { rerender, container } = render(
      <AuditResult projectName={projectName} />
    );
    expect(getTaskSqlSpy).not.toBeCalled();
    rerender(
      <AuditResult taskId={9999} passRate={0.1667} projectName={projectName} />
    );
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    expect(getTaskSqlSpy).toBeCalledWith({
      task_id: '9999',
      page_index: '1',
      page_size: '10',
      no_duplicate: false,
    });

    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getBySelector('.result-box-error')).toBeInTheDocument();
    expect(
      getBySelector('.ant-table-row-expand-icon-cell .anticon-down')
    ).toBeVisible();

    fireEvent.click(
      getBySelector('.ant-table-row-expand-icon-cell .anticon-down')
    );
    await act(() =>
      expect(getBySelector('.ant-table-row-expand-icon-cell .anticon-up'))
    );
    expect(getBySelector('.ant-table-expanded-row')).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  test('should call updateTaskRecordTotalNum when get sql success', async () => {
    mockGetTaskSqls();
    const taskId = 9999;
    const updateTotalNum = jest.fn();
    render(
      <AuditResult
        taskId={taskId}
        updateTaskRecordTotalNum={updateTotalNum}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateTotalNum).toBeCalledTimes(1);
    expect(updateTotalNum).toBeCalledWith(`${taskId}`, 20);
  });

  test('should set duplicate of table filter when change switch', async () => {
    const getTaskSqlSpy = mockGetTaskSqls();
    render(
      <AuditResult taskId={9999} passRate={0.33} projectName={projectName} />
    );
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    expect(getTaskSqlSpy).toBeCalledWith({
      task_id: '9999',
      page_index: '1',
      page_size: '10',
      no_duplicate: false,
    });
    const switchElement = getBySelector('.ant-switch');
    fireEvent.click(switchElement);
    expect(getTaskSqlSpy).toBeCalledTimes(2);
    expect(getTaskSqlSpy).toBeCalledWith({
      task_id: '9999',
      page_index: '1',
      page_size: '10',
      no_duplicate: true,
    });
  });

  test('should send download sql file request  when click download sql button', () => {
    mockGetTaskSqls();
    render(
      <AuditResult taskId={9999} passRate={0.33} projectName={projectName} />
    );
    const download = jest.spyOn(task, 'downloadAuditTaskSQLFileV1');
    download.mockImplementation(() => resolveThreeSecond({}));

    fireEvent.click(screen.getByText('audit.downloadSql'));

    expect(download).toBeCalledTimes(1);
    expect(download).toBeCalledWith({ task_id: '9999' });
  });

  test('should send download sql report request  when click download sql button', () => {
    mockGetTaskSqls();
    render(
      <AuditResult taskId={9999} passRate={0.33} projectName={projectName} />
    );
    const download = jest.spyOn(task, 'downloadAuditTaskSQLReportV1');
    download.mockImplementation(() => resolveThreeSecond({}));

    fireEvent.click(screen.getByText('audit.downloadReport'));

    expect(download).toBeCalledTimes(1);
    expect(download).toBeCalledWith({ task_id: '9999', no_duplicate: false });

    const switchElement = getBySelector('.ant-switch');
    fireEvent.click(switchElement);
    fireEvent.click(screen.getByText('audit.downloadReport'));

    expect(download).toBeCalledTimes(2);
    expect(download).toBeCalledWith({ task_id: '9999', no_duplicate: true });
  });

  test('should send update sql describe request when user click update describe in table', async () => {
    const getSqlSpy = mockGetTaskSqls();
    const updateTaskSqlSpy = mockUpdateTaskSqlDesc();
    render(
      <AuditResult taskId={9999} passRate={0.33} projectName={projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getAllBySelector('.ant-typography-edit')[0]);
    fireEvent.change(getBySelector('.ant-input'), {
      target: { value: 'new value' },
    });
    // ant design will check user press up key is same as press down key....
    fireEvent.keyDown(getBySelector('.ant-input'), {
      key: 'Enter',
      code: 13,
      keyCode: 13,
    });
    fireEvent.keyUp(getBySelector('.ant-input'), {
      key: 'Enter',
      code: 13,
      keyCode: 13,
    });
    expect(updateTaskSqlSpy).toBeCalledTimes(1);
    expect(getSqlSpy).toBeCalledTimes(1);
    expect(updateTaskSqlSpy).toBeCalledWith({
      task_id: '9999',
      description: 'new value',
      number: '1',
    });

    fireEvent.click(getAllBySelector('.ant-typography-edit')[0]);
    fireEvent.change(getBySelector('.ant-input'), {
      target: { value: 'new value2222' },
    });
    // ant design will check user press up key is same as press down key....
    fireEvent.keyDown(getBySelector('.ant-input'), {
      key: 'Enter',
      code: 13,
      keyCode: 13,
    });
    fireEvent.keyUp(getBySelector('.ant-input'), {
      key: 'Enter',
      code: 13,
      keyCode: 13,
    });

    expect(updateTaskSqlSpy).toBeCalledTimes(1);
    expect(getSqlSpy).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSqlSpy).toBeCalledTimes(2);
  });

  test('should jump to sql analyze page when click analyze button', async () => {
    mockGetTaskSqls();
    render(<AuditResult taskId={9999} passRate={0.33} projectName="default" />);
    await act(async () => jest.advanceTimersByTime(3000));

    const openSpy = jest.spyOn(window, 'open');
    openSpy.mockImplementation(() => null);
    fireEvent.click(screen.getAllByText('audit.table.analyze')[0]);
    expect(openSpy).toBeCalledTimes(1);
    expect(openSpy).toBeCalledWith(`/project/default/order/9999/1/analyze`);
    openSpy.mockRestore();
  });

  test('should call get all rules request', async () => {
    mockGetTaskSqls();
    render(<AuditResult taskId={9999} projectName="default" />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getAllRulesSpy).toBeCalledTimes(1);
    expect(getAllRulesSpy).nthCalledWith(1, {
      filter_rule_names: 'all_check_where_is_invalid',
    });
  });
});
