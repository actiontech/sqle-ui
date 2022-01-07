import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import AuditResult, { isExistNotAllowLevel } from '.';
import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '../../../api/common.enum';
import instance from '../../../api/instance';
import task from '../../../api/task';
import { getBySelector } from '../../../testUtils/customQuery';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';
import { instanceWorkflowTemplate, taskSqls } from '../Detail/__testData__';

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

  const mockGetInstanceWorkFlow = () => {
    const spy = jest.spyOn(instance, 'getInstanceWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceWorkflowTemplate));
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

  test('should get instance workflow when pass task id and instance name into component props', async () => {
    const getTaskSqlSpy = mockGetTaskSqls();
    const getInstanceWorkflowTemplate = mockGetInstanceWorkFlow();
    const { container, rerender } = render(<AuditResult />);
    expect(getTaskSqlSpy).not.toBeCalled();
    const instance_name = 'test';
    rerender(
      <AuditResult taskId={9999} passRate={0.33} instanceName={instance_name} />
    );
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getInstanceWorkflowTemplate).toBeCalledTimes(1);
    expect(getInstanceWorkflowTemplate).toBeCalledWith({
      instance_name,
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

  test('should not call setTheCreateOrderDisabled when instance name not into component props', async () => {
    const getTaskSqlSpy = mockGetTaskSqls();
    const mockSetCreateOrderDisabled = jest.fn();
    render(
      <AuditResult
        taskId={9999}
        passRate={0.33}
        setCreateOrderDisabled={mockSetCreateOrderDisabled}
      />
    );
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockSetCreateOrderDisabled).toBeCalledTimes(0);
  });

  test('should call setTheCreateOrderDisabled when meet the conditions', async () => {
    const instance_name = 'test';
    const mockSetCreateOrderDisabled = jest.fn();
    const getInstanceWorkflowTemplate = mockGetInstanceWorkFlow();
    const getTaskSqlSpy = mockGetTaskSqls();

    render(
      <AuditResult
        taskId={9999}
        passRate={0.33}
        instanceName={instance_name}
        setCreateOrderDisabled={mockSetCreateOrderDisabled}
      />
    );
    expect(getTaskSqlSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getInstanceWorkflowTemplate).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockSetCreateOrderDisabled).toBeCalledTimes(1);
  });

  test('should have the expected result when the corresponding parameters are passed in', () => {
    const tableList1 = undefined;
    expect(isExistNotAllowLevel(tableList1, undefined)).toBeFalsy();

    const tableList2 = [{ audit_level: '' }];
    expect(
      isExistNotAllowLevel(
        tableList2,
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn
      )
    ).toBeFalsy();

    const tableList3 = [
      {
        audit_level:
          CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error,
      },
    ];
    expect(
      isExistNotAllowLevel(
        tableList3,
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error
      )
    ).toBeFalsy();

    const tableList4 = [
      {
        audit_level:
          CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal,
      },
      {
        audit_level:
          CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.notice,
      },
      {
        audit_level:
          CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn,
      },
      {
        audit_level:
          CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error,
      },
    ];

    expect(
      isExistNotAllowLevel(
        tableList4,
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.error
      )
    ).toBeFalsy();

    expect(
      isExistNotAllowLevel(
        tableList4,
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn
      )
    ).toBeTruthy();

    expect(
      isExistNotAllowLevel(
        tableList4,
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.notice
      )
    ).toBeTruthy();

    expect(
      isExistNotAllowLevel(
        tableList4,
        CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal
      )
    ).toBeTruthy();
  });
});
