import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import AuditResult from '.';
import task from '../../../api/task';
import {
  getAllBySelector,
  getBySelector,
} from '../../../testUtils/customQuery';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { taskSqls } from '../Detail/__testData__';

describe('Order/Detail/AuditResult', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  const mockGetTaskSqls = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV1');
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
    const { container, rerender } = render(<AuditResult />);
    expect(getTaskSqlSpy).not.toBeCalled();
    rerender(<AuditResult taskId={9999} passRate={0.1667} />);
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    expect(getTaskSqlSpy).toBeCalledWith({
      task_id: '9999',
      page_index: '1',
      page_size: '10',
      no_duplicate: false,
    });
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should call updateTaskRecordTotalNum when get sql success', async () => {
    mockGetTaskSqls();
    const updateTotalNum = jest.fn();
    render(
      <AuditResult taskId={9999} updateTaskRecordTotalNum={updateTotalNum} />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(updateTotalNum).toBeCalledTimes(1);
    expect(updateTotalNum).toBeCalledWith(20);
  });

  test('should set duplicate of table filter when change switch', async () => {
    const getTaskSqlSpy = mockGetTaskSqls();
    render(<AuditResult taskId={9999} passRate={0.33} />);
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
    render(<AuditResult taskId={9999} passRate={0.33} />);
    const download = jest.spyOn(task, 'downloadAuditTaskSQLFileV1');
    download.mockImplementation(() => resolveThreeSecond({}));

    fireEvent.click(screen.getByText('audit.downloadSql'));

    expect(download).toBeCalledTimes(1);
    expect(download).toBeCalledWith({ task_id: '9999' });
  });

  test('should send download sql report request  when click download sql button', () => {
    mockGetTaskSqls();
    render(<AuditResult taskId={9999} passRate={0.33} />);
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
    render(<AuditResult taskId={9999} passRate={0.33} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
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

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getSqlSpy).toBeCalledTimes(2);
  });

  it('should jump to sql analyze page when click analyze button', async () => {
    mockGetTaskSqls();
    render(<AuditResult taskId={9999} passRate={0.33} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    const openSpy = jest.spyOn(window, 'open');
    openSpy.mockImplementation(() => null);
    fireEvent.click(screen.getAllByText('audit.table.analyze')[0]);
    expect(openSpy).toBeCalledTimes(1);
    expect(openSpy).toBeCalledWith(`/order/9999/1/analyze`);
    openSpy.mockRestore();
  });
});
