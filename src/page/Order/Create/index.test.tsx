import { fireEvent, waitFor, screen } from '@testing-library/react';
import CreateOrder from '.';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import EmitterKey from '../../../data/EmitterKey';
import { getBySelector } from '../../../testUtils/customQuery';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseInstanceSchema,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import { SupportTheme } from '../../../theme';
import EventEmitter from '../../../utils/EventEmitter';
import { taskInfo, taskSqls } from '../Detail/__testData__';

// https://github.com/react-monaco-editor/react-monaco-editor/issues/176
jest.mock('react-monaco-editor', () => {
  return (props: any) => <input {...props} />;
});

describe('Order/Create', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { theme: SupportTheme.LIGHT } });
    mockUseDispatch();
    mockUseInstance();
    mockUseInstanceSchema();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockCreateTask = () => {
    const spy = jest.spyOn(task, 'createAndAuditTaskV1');
    spy.mockImplementation(() => resolveThreeSecond(taskInfo));
    return spy;
  };

  const mockGetTaskSql = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV1');
    spy.mockImplementation(() => resolveThreeSecond(taskSqls));
    return spy;
  };

  const mockCreateOrder = () => {
    const spy = jest.spyOn(workflow, 'createWorkflowV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should render page header', async () => {
    const { baseElement } = renderWithThemeAndRouter(<CreateOrder />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should audit sql when user click audit button', async () => {
    const createTaskSpy = mockCreateTask();
    mockGetTaskSql();
    const { container } = renderWithThemeAndRouter(<CreateOrder />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceSchema'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const schemaOptions = screen.getAllByText('schema1');
    const schema = schemaOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schema);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(createTaskSpy).toBeCalledTimes(1);
    expect(createTaskSpy).toBeCalledWith({
      instance_name: 'instance1',
      instance_schema: 'schema1',
      input_mybatis_xml_file: undefined,
      input_sql_file: undefined,
      sql: 'select * from table2',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should create order when user input all require fields', async () => {
    mockCreateTask();
    mockGetTaskSql();
    const createOrderSpy = mockCreateOrder();
    renderWithThemeAndRouter(<CreateOrder />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: 'orderName' },
    });
    fireEvent.input(screen.getByLabelText('order.baseInfo.describe'), {
      target: { value: 'order describe' },
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceSchema'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const schemaOptions = screen.getAllByText('schema1');
    const schema = schemaOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schema);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(screen.getByText('order.createOrder.title'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(
      screen.queryByText('order.createOrder.mustAuditTips')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByText('order.createOrder.title'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(createOrderSpy).toBeCalledTimes(1);
    expect(screen.getByText('order.createOrder.title').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(createOrderSpy).toBeCalledWith({
      desc: 'order describe',
      task_id: String(taskInfo.task_id),
      workflow_subject: 'orderName',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.createOrder.title').parentNode
    ).not.toHaveClass('ant-btn-loading');

    expect(getBySelector('.ant-modal-wrap')).toMatchSnapshot();
    expect(
      screen.queryByLabelText('audit.table.auditStatus')
    ).toBeInTheDocument();
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    fireEvent.click(screen.getByText('common.resetAndClose'));

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Reset_Create_Order_Form);
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
    expect(screen.getByLabelText('order.baseInfo.name')).toHaveValue('');
    expect(
      screen.queryByLabelText('audit.table.auditStatus')
    ).not.toBeInTheDocument();
  });

  test('should show tips of unsave sql when form have dirty data at click create order', async () => {
    mockCreateTask();
    mockGetTaskSql();
    renderWithThemeAndRouter(<CreateOrder />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: 'orderName' },
    });
    fireEvent.input(screen.getByLabelText('order.baseInfo.describe'), {
      target: { value: 'order describe' },
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceSchema'));

    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const schemaOptions = screen.getAllByText('schema1');
    const schema = schemaOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schema);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });

    fireEvent.click(screen.getByText('order.createOrder.title'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(
      screen.queryByText('order.createOrder.dirtyDataTips')
    ).toBeInTheDocument();
  });
});