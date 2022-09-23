/* eslint-disable no-console */
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import ModifySqlModal from '.';
import {
  AuditTaskResV1SqlSourceEnum,
  WorkflowResV2ModeEnum,
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
  let tempErrorConsole: typeof console.error;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { theme: SupportTheme.LIGHT } });
    mockUseDispatch();
    mockCreateAuditTasksV1();
    mockAuditTaskGroupId();
    console.error = (params: any) => {
      if (
        params.includes('A component is changing an uncontrolled input to be ')
      ) {
        return;
      }
      tempErrorConsole(params);
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    console.error = tempErrorConsole;
  });

  const mockGetSqlContent = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLContentV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({ sql: 'select * from table1' })
    );
    return spy;
  };

  // const mockCreateTask = () => {
  //   const spy = jest.spyOn(task, 'createAndAuditTaskV1');
  //   spy.mockImplementation(() => resolveThreeSecond(taskInfoErrorAuditLevel));
  //   return spy;
  // };

  const mockCreateAuditTasksV1 = () => {
    const spy = jest.spyOn(task, 'createAuditTasksV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
      })
    );
    return spy;
  };

  const mockAuditTaskGroupId = () => {
    const spy = jest.spyOn(task, 'auditTaskGroupIdV1');
    spy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfo],
      })
    );
    return spy;
  };

  test('should match snapshot', () => {
    const { baseElement } = renderWithTheme(
      <ModifySqlModal
        visible={false}
        submit={jest.fn()}
        cancel={jest.fn()}
        sqlMode={WorkflowResV2ModeEnum.same_sqls}
      />
    );
    expect(baseElement).toMatchSnapshot();
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
        sqlMode={WorkflowResV2ModeEnum.same_sqls}
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
        sqlMode={WorkflowResV2ModeEnum.same_sqls}
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
        sqlMode={WorkflowResV2ModeEnum.same_sqls}
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
        sqlMode={WorkflowResV2ModeEnum.same_sqls}
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
  });

  test('should send sql field without input_sql_file field when user input sql in editor', async () => {
    const tempTask = cloneDeep(taskInfo);
    mockGetSqlContent();
    const createAuditTaskSpy = mockCreateAuditTasksV1();
    const auditTaskGroupIdSpy = mockAuditTaskGroupId();
    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={jest.fn()}
        cancel={jest.fn()}
        sqlMode={WorkflowResV2ModeEnum.same_sqls}
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
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(createAuditTaskSpy).toBeCalledTimes(1);
    expect(createAuditTaskSpy).toBeCalledWith({
      instances: [
        {
          instance_name: 'db1',
          instance_schema: '',
        },
      ],
    });
    expect(auditTaskGroupIdSpy).toBeCalledTimes(0);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(auditTaskGroupIdSpy).toBeCalledTimes(1);
    expect(auditTaskGroupIdSpy).toBeCalledWith({
      sql: 'select * from table2',
      task_group_id: 11,
    });
  });

  test('should send sql file when user upload sql file', async () => {
    const tempTask = cloneDeep(taskInfo);
    mockGetSqlContent();
    const propsSubmit = jest.fn();
    const createAuditTaskSpy = mockCreateAuditTasksV1();
    const auditTaskGroupIdSpy = mockAuditTaskGroupId();
    auditTaskGroupIdSpy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfoErrorAuditLevel],
      })
    );
    tempTask.instance_schema = 'schema1';
    const { baseElement } = renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={propsSubmit}
        cancel={jest.fn()}
        sqlMode={WorkflowResV2ModeEnum.same_sqls}
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
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(createAuditTaskSpy).toBeCalledTimes(1);
    expect(createAuditTaskSpy).toBeCalledWith({
      instances: [
        {
          instance_name: 'db1',
          instance_schema: 'schema1',
        },
      ],
    });
    expect(auditTaskGroupIdSpy).toBeCalledTimes(0);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(auditTaskGroupIdSpy).toBeCalledTimes(1);
    expect(auditTaskGroupIdSpy).toBeCalledWith({
      input_sql_file: sqlFile,
      task_group_id: 11,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(propsSubmit).toBeCalledTimes(1);
    expect(propsSubmit).toBeCalledWith([taskInfoErrorAuditLevel]);
  });
});
