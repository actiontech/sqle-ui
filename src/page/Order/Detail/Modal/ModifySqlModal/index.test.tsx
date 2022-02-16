import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import ModifySqlModal from '.';
import { AuditTaskResV1SqlSourceEnum } from '../../../../../api/common.enum';
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
  beforeEach(() => {
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

  const mockCreateTask = () => {
    const spy = jest.spyOn(task, 'createAndAuditTaskV1');
    spy.mockImplementation(() => resolveThreeSecond(taskInfoErrorAuditLevel));
    return spy;
  };

  test('should match snapshot', () => {
    const { baseElement } = renderWithTheme(
      <ModifySqlModal
        visible={false}
        submit={jest.fn()}
        cancel={jest.fn()}
        currentOrderTask={taskInfo}
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
        currentOrderTask={tempTask}
      />
    );
    expect(getSqlContentSpy).not.toBeCalled();
    cleanup();
    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={jest.fn()}
        cancel={jest.fn()}
        currentOrderTask={tempTask}
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
        currentOrderTask={tempTask}
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
        currentOrderTask={tempTask}
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
    const createTaskSpy = mockCreateTask();
    renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={jest.fn()}
        cancel={jest.fn()}
        currentOrderTask={tempTask}
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
    expect(createTaskSpy).toBeCalledTimes(1);
    expect(createTaskSpy).toBeCalledWith({
      instance_name: tempTask.instance_name,
      sql: 'select * from table2',
    });
  });

  test('should send sql file when user upload sql file', async () => {
    const tempTask = cloneDeep(taskInfo);
    mockGetSqlContent();
    const propsSubmit = jest.fn();
    const createTaskSpy = mockCreateTask();
    tempTask.instance_schema = 'schema1';
    const { baseElement } = renderWithTheme(
      <ModifySqlModal
        visible={true}
        submit={propsSubmit}
        cancel={jest.fn()}
        currentOrderTask={tempTask}
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
    expect(createTaskSpy).toBeCalledTimes(1);
    expect(createTaskSpy).toBeCalledWith({
      instance_name: tempTask.instance_name,
      instance_schema: tempTask.instance_schema,
      input_sql_file: sqlFile,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(propsSubmit).toBeCalledTimes(1);
    expect(propsSubmit).toBeCalledWith(taskInfoErrorAuditLevel);
  });
});
