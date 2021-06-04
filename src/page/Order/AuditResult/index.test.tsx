import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import AuditResult from '.';
import task from '../../../api/task';
import { getBySelector } from '../../../testUtils/customQuery';
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
    spy.mockImplementation(() => resolveThreeSecond(taskSqls));
    return spy;
  };

  test('should get task sql info when pass task id into component props', async () => {
    const getTaskSqlSpy = mockGetTaskSqls();
    const { container, rerender } = render(<AuditResult />);
    expect(getTaskSqlSpy).not.toBeCalled();
    rerender(<AuditResult taskId={9999} passRate={0.33} />);
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
});
