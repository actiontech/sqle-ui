import { fireEvent, waitFor, screen } from '@testing-library/react';
import CreateOrder from '.';
import instance from '../../../api/instance';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import EmitterKey from '../../../data/EmitterKey';
import {
  getBySelector,
  selectOptionByIndex,
} from '../../../testUtils/customQuery';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseInstanceSchema,
  resolveThreeSecond,
  mockDriver,
} from '../../../testUtils/mockRequest';
import { SupportTheme } from '../../../theme';
import EventEmitter from '../../../utils/EventEmitter';
import {
  instanceWorkflowTemplate,
  taskInfo,
  taskInfoErrorAuditLevel,
  taskSqls,
} from '../Detail/__testData__';

const orderDescMaxLength = 50;

jest.mock('moment', () => {
  return () => ({
    format: () => '19700101010101',
  });
});

describe('Order/Create', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSelector({ user: { theme: SupportTheme.LIGHT } });
    mockUseDispatch();
    mockUseInstance();
    mockUseInstanceSchema();
    mockDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockCreateAuditTasks = () => {
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

  const mockCreateAndAuditTask = () => {
    const spy = jest.spyOn(task, 'createAndAuditTaskV1');
    spy.mockImplementation(() => resolveThreeSecond(taskInfo));
    return spy;
  };

  const mockGetTaskSql = () => {
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV1');
    spy.mockImplementation(() =>
      resolveThreeSecond(taskSqls, { otherData: { total_nums: 20 } })
    );
    return spy;
  };

  const mockCreateOrder = () => {
    const spy = jest.spyOn(workflow, 'createWorkflowV2');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockGetInstanceWorkflowTemplate = () => {
    const spy = jest.spyOn(instance, 'getInstanceWorkflowTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(instanceWorkflowTemplate));
    return spy;
  };

  test('should render page header', async () => {
    const { baseElement } = renderWithThemeAndRouter(<CreateOrder />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should audit sql when user click audit button', async () => {
    //different
    const createAndAuditTaskSpy = mockCreateAndAuditTask();

    //same
    const createAuditTasksSpy = mockCreateAuditTasks();
    const auditTasksGroupIdSpy = mockAuditTaskGroupId();

    const getInstanceWorkflow = mockGetInstanceWorkflowTemplate();
    const dateSpy = jest.spyOn(Date, 'now');
    dateSpy.mockReturnValue(
      new Date('August 19, 1975 23:15:30 GMT+07:00').getTime()
    );
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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(createAuditTasksSpy).toBeCalledTimes(1);
    expect(createAuditTasksSpy).toBeCalledWith({
      instances: [
        {
          instance_name: 'instance1',
          instance_schema: 'schema1',
        },
      ],
    });

    expect(auditTasksGroupIdSpy).toBeCalledTimes(1);
    expect(auditTasksGroupIdSpy).toBeCalledWith({
      task_group_id: 11,
      sql: 'select * from table2',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getInstanceWorkflow).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    //different
    fireEvent.click(screen.getByLabelText('order.sqlInfo.isSameSqlOrder'));
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table5' },
    });
    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(createAndAuditTaskSpy).toBeCalledTimes(1);
    expect(createAndAuditTaskSpy).toBeCalledWith({
      instance_name: 'instance1',
      instance_schema: 'schema1',
      sql: 'select * from table5',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    dateSpy.mockRestore();
  });

  test('should create order when user input all require fields', async () => {
    mockCreateAuditTasks();
    mockAuditTaskGroupId();
    mockGetInstanceWorkflowTemplate();
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
      target: {
        value: Array.from({ length: orderDescMaxLength + 1 }, () => 'e').join(
          ''
        ),
      },
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
      desc: Array.from({ length: orderDescMaxLength }, () => 'e').join(''),
      task_ids: [taskInfo.task_id],
      workflow_subject: 'orderName',
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.createOrder.title').parentNode
    ).not.toHaveClass('ant-btn-loading');

    expect(getBySelector('.ant-modal-wrap')).toMatchSnapshot();

    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    fireEvent.click(screen.getByText('common.resetAndClose'));

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Reset_Create_Order_Form);
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
    expect(screen.getByLabelText('order.baseInfo.name')).toHaveValue('');
  });

  test('should show tips of unsave sql when form have dirty data at click create order', async () => {
    mockCreateAuditTasks();
    mockAuditTaskGroupId();
    mockGetInstanceWorkflowTemplate();
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

  test('should be set create order button to disabled  when the sql audit result level does not conform to the configuration', async () => {
    const createAuditTasksSpy = mockCreateAuditTasks();
    const auditTasksGroupIdSpy = mockAuditTaskGroupId();
    auditTasksGroupIdSpy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfoErrorAuditLevel],
      })
    );

    const createOrderSpy = mockCreateOrder();
    const getInstanceWorkflowTemplate = mockGetInstanceWorkflowTemplate();
    mockGetTaskSql();
    renderWithThemeAndRouter(<CreateOrder />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getInstanceWorkflowTemplate).toBeCalledTimes(0);
    expect(createAuditTasksSpy).toBeCalledTimes(0);
    expect(createOrderSpy).toBeCalledTimes(0);

    fireEvent.input(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: 'orderName' },
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getInstanceWorkflowTemplate).toBeCalledTimes(1);
    expect(createAuditTasksSpy).toBeCalledTimes(1);
    expect(auditTasksGroupIdSpy).toBeCalledTimes(1);

    expect(
      screen.getByText('order.createOrder.title').closest('button')
    ).toBeDisabled();

    fireEvent.click(screen.getByText('order.createOrder.title'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(createOrderSpy).toBeCalledTimes(0);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });
    expect(
      screen.getByText('order.createOrder.title').closest('button')
    ).toBeDisabled();

    auditTasksGroupIdSpy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfo],
      })
    );
    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.getByText('order.createOrder.title').closest('button')
    ).not.toBeDisabled();

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });
    expect(
      screen.getByText('order.createOrder.title').closest('button')
    ).not.toBeDisabled();
  });

  test('should can not create order when the result total num of get audit sql is 0', async () => {
    mockCreateAuditTasks();
    mockAuditTaskGroupId();
    const createOrderSpy = mockCreateOrder();
    mockGetInstanceWorkflowTemplate();
    const getSqlSpy = mockGetTaskSql();
    getSqlSpy.mockImplementation(() =>
      resolveThreeSecond(taskSqls, { otherData: { total_nums: 0 } })
    );
    renderWithThemeAndRouter(<CreateOrder />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: 'orderName' },
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    fireEvent.click(instance);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

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
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.click(screen.getByText('order.createOrder.title'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(createOrderSpy).toBeCalledTimes(0);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });
    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
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
    expect(createOrderSpy).toBeCalledTimes(0);
    expect(
      screen.queryByText('order.createOrder.mustHaveAuditResultTips')
    ).toBeInTheDocument();
  });

  test('should generate order name after user select a data source when user do not input order name', async () => {
    renderWithThemeAndRouter(<CreateOrder />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    selectOptionByIndex('order.sqlInfo.instanceName', 'instance1', 1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByLabelText('order.baseInfo.name')).toHaveValue(
      'instance1_19700101010101'
    );
  });
});
