/* eslint-disable no-console */
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import ModifySqlModal from '.';
import {
  AuditTaskResV1SqlSourceEnum,
  WorkflowResV1ModeEnum,
} from '../../../../../api/common.enum';
import task from '../../../../../api/task';
import { renderWithTheme } from '../../../../../testUtils/customRender';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../../theme';
import { taskInfo, taskInfoErrorAuditLevel } from '../../__testData__';

describe('Order/Detail/Modal/ModifySqlModal', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockImplementation(() => resolveThreeSecond({}));
    jest.useFakeTimers();
    mockUseSelector({ user: { theme: SupportTheme.LIGHT } });
    mockUseDispatch();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetSqlContent = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLContentV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({ sql: 'select * from table1' })
    );
    return spy;
  };

  test('should match snapshot', () => {
    const { baseElement: baseElement1 } = renderWithTheme(
      <ModifySqlModal
        visible={false}
        submit={jest.fn()}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.same_sqls}
        currentOrderTasks={[taskInfo]}
      />
    );
    expect(baseElement1).toMatchSnapshot();

    cleanup();
    const { baseElement: baseElement2 } = renderWithTheme(
      <ModifySqlModal
        visible={false}
        submit={jest.fn()}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.different_sqls}
        currentOrderTasks={[taskInfo, taskInfoErrorAuditLevel]}
      />
    );
    expect(baseElement2).toMatchSnapshot();
  });

  test('should get sql content when sql from type is "form_data"', async () => {
    const tempTask = cloneDeep(taskInfo);
    const getSqlContentSpy = mockGetSqlContent();
    tempTask.sql_source = AuditTaskResV1SqlSourceEnum.sql_file;
    renderWithTheme(
      <ModifySqlModal
        visible={false}
        submit={jest.fn()}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.same_sqls}
        currentOrderTasks={[tempTask]}
      />
    );
    expect(getSqlContentSpy).not.toBeCalled();
    cleanup();
    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={jest.fn()}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.same_sqls}
        currentOrderTasks={[tempTask]}
      />
    );
    expect(getSqlContentSpy).not.toBeCalled();
    tempTask.sql_source = AuditTaskResV1SqlSourceEnum.mybatis_xml_file;
    cleanup();
    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={jest.fn()}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.same_sqls}
        currentOrderTasks={[tempTask]}
      />
    );
    expect(getSqlContentSpy).not.toBeCalled();
    tempTask.sql_source = AuditTaskResV1SqlSourceEnum.form_data;
    cleanup();
    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={jest.fn()}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.same_sqls}
        currentOrderTasks={[tempTask]}
      />
    );
    expect(getSqlContentSpy).toBeCalledTimes(1);
    expect(getSqlContentSpy).toBeCalledWith({ task_id: `${tempTask.task_id}` });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue(
      'select * from table1'
    );
    cleanup();
    getSqlContentSpy.mockClear();

    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={jest.fn()}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.different_sqls}
        currentOrderTasks={[tempTask, taskInfoErrorAuditLevel]}
      />
    );
    expect(getSqlContentSpy).toBeCalledTimes(2);
    expect(getSqlContentSpy).toBeCalledWith({ task_id: `${tempTask.task_id}` });
    expect(getSqlContentSpy).toBeCalledWith({
      task_id: `${taskInfoErrorAuditLevel.task_id}`,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getAllByLabelText('order.sqlInfo.sql')[0]).toHaveValue(
      'select * from table1'
    );
    expect(screen.getAllByLabelText('order.sqlInfo.sql')[1]).toHaveValue(
      'select * from table1'
    );
  });

  test('should send sql field without input_sql_file field when user input sql in editor', async () => {
    const tempTask = cloneDeep(taskInfo);
    mockGetSqlContent();

    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={mockSubmit}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.same_sqls}
        currentOrderTasks={[tempTask]}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByLabelText('order.sqlInfo.sql')).toHaveValue(
      'select * from table1'
    );
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });
    fireEvent.click(screen.getByText('common.submit'));
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith(
      {
        '0': {
          sql: 'select * from table2',
          sqlInputType: 0,
        },
        dataBaseInfo: [
          {
            instanceName: 'db1',
            instanceSchema: '',
          },
        ],
        isSameSqlOrder: true,
      },
      0,
      ''
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );

    cleanup();
    mockSubmit.mockClear();

    //different sql
    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={mockSubmit}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.different_sqls}
        currentOrderTasks={[tempTask, taskInfoErrorAuditLevel]}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getAllByText('db1')[0]);
    fireEvent.input(screen.getAllByLabelText('order.sqlInfo.sql')[0], {
      target: { value: 'select * from table2' },
    });
    fireEvent.click(screen.getByText('common.submit'));
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith(
      {
        [tempTask.task_id!]: {
          sql: 'select * from table2',
          sqlInputType: 0,
        },
        [taskInfoErrorAuditLevel.task_id!]: {
          sql: 'select * from table1',
          sqlInputType: 0,
        },
        dataBaseInfo: [
          {
            instanceName: 'db1',
            instanceSchema: '',
          },
          {
            instanceName: 'db1',
            instanceSchema: '',
          },
        ],
        isSameSqlOrder: false,
      },
      0,
      tempTask.task_id!.toString()
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );

    fireEvent.click(screen.getAllByText('db1')[1]);
    fireEvent.input(screen.getAllByLabelText('order.sqlInfo.sql')[1], {
      target: { value: 'select * from table4' },
    });
    fireEvent.click(screen.getByText('common.submit'));
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(mockSubmit).toBeCalledTimes(2);
    expect(mockSubmit).toBeCalledWith(
      {
        [tempTask.task_id!]: {
          sql: 'select * from table2',
          sqlInputType: 0,
        },
        [taskInfoErrorAuditLevel.task_id!]: {
          sql: 'select * from table4',
          sqlInputType: 0,
        },
        dataBaseInfo: [
          {
            instanceName: 'db1',
            instanceSchema: '',
          },
          {
            instanceName: 'db1',
            instanceSchema: '',
          },
        ],
        isSameSqlOrder: false,
      },
      1,
      taskInfoErrorAuditLevel.task_id!.toString()
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
  });

  test('should send sql file when user upload sql file', async () => {
    const tempTask = cloneDeep(taskInfo);
    mockGetSqlContent();

    tempTask.instance_schema = 'schema1';
    const { baseElement } = renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={mockSubmit}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.same_sqls}
        currentOrderTasks={[tempTask]}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByText('order.sqlInfo.uploadFile'));
    expect(baseElement).toMatchSnapshot();
    const sqlFile = new File(
      [new Blob(['select * from table_test'], { type: 'text/plain' })],
      'test.sql'
    );
    fireEvent.change(screen.getByLabelText('order.sqlInfo.sqlFile'), {
      target: { files: [sqlFile] },
    });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.submit'));
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith(
      {
        '0': {
          sqlFile: [sqlFile],
          sqlInputType: 1,
        },
        dataBaseInfo: [
          {
            instanceName: 'db1',
            instanceSchema: 'schema1',
          },
        ],
        isSameSqlOrder: true,
      },
      0,
      ''
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );

    cleanup();
    mockSubmit.mockClear();

    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={mockSubmit}
        cancel={jest.fn()}
        sqlMode={WorkflowResV1ModeEnum.different_sqls}
        currentOrderTasks={[tempTask, taskInfoErrorAuditLevel]}
      />
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getAllByText('order.sqlInfo.uploadFile')[1]);
    fireEvent.change(screen.getByLabelText('order.sqlInfo.sqlFile'), {
      target: { files: [sqlFile] },
    });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.submit'));
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith(
      {
        '27': {
          sql: 'select * from table1',
          sqlInputType: 0,
        },
        '3': {
          sqlFile: [sqlFile],
          sqlInputType: 1,
        },
        dataBaseInfo: [
          {
            instanceName: 'db1',
            instanceSchema: 'schema1',
          },
          {
            instanceName: 'db1',
            instanceSchema: '',
          },
        ],
        isSameSqlOrder: false,
      },
      1,
      '3'
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
  });

  test('should called cancel props when clicking close button', async () => {
    const mockCancel = jest.fn();
    mockGetSqlContent();
    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={mockSubmit}
        cancel={mockCancel}
        sqlMode={WorkflowResV1ModeEnum.different_sqls}
        currentOrderTasks={[taskInfoErrorAuditLevel]}
      />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockCancel).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.close'));
    expect(mockCancel).toBeCalledTimes(1);
  });
});
