import { act, fireEvent, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import CreateOrder, { workflowNameRule } from '.';
import task from '../../../api/task';
import workflow from '../../../api/workflow';
import EmitterKey from '../../../data/EmitterKey';
import {
  getBySelector,
  getHrefByText,
  selectOptionByIndex,
} from '../../../testUtils/customQuery';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import {
  mockUseInstance,
  mockUseInstanceSchema,
  resolveThreeSecond,
  mockDriver,
} from '../../../testUtils/mockRequest';
import { SupportTheme } from '../../../theme';
import EventEmitter from '../../../utils/EventEmitter';
import { mockGetAllRules } from '../../Rule/__test__/utils';
import {
  instanceWorkflowTemplate,
  taskInfo,
  taskInfoErrorAuditLevel,
  taskSqls,
} from '../Detail/__testData__';
import { useDispatch, useSelector } from 'react-redux';
import { mockGetInstance } from './SqlInfoForm/__test__/common';

const orderDescMaxLength = 3000;

jest.mock('moment', () => {
  return () => ({
    format: () => '19700101010101',
  });
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('Order/Create', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { theme: SupportTheme.LIGHT },
      })
    );
    mockUseInstance();
    mockUseInstanceSchema();
    mockDriver();
    mockGetAllRules();
    mockGetInstance();
    useParamsMock.mockReturnValue({ projectName });
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
    const spy = jest.spyOn(task, 'getAuditTaskSQLsV2');
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
    const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
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
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.change(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: '数据源测试' },
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceSchema'));
    await act(async () => jest.advanceTimersByTime(0));

    const schemaOptions = screen.getAllByText('schema1');
    const schema = schemaOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schema);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(0));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(createAuditTasksSpy).toBeCalledTimes(1);
    expect(createAuditTasksSpy).toBeCalledWith({
      project_name: projectName,
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

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getInstanceWorkflow).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();

    //different
    fireEvent.click(screen.getByLabelText('order.sqlInfo.isSameSqlOrder'));
    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table5' },
    });
    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(createAndAuditTaskSpy).toBeCalledTimes(1);
    expect(createAndAuditTaskSpy).toBeCalledWith({
      project_name: projectName,
      instance_name: 'instance1',
      instance_schema: 'schema1',
      sql: 'select * from table5',
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    dateSpy.mockRestore();
  });

  test('should create order when user input all require fields', async () => {
    mockCreateAuditTasks();
    mockAuditTaskGroupId();
    mockGetInstanceWorkflowTemplate();
    mockGetTaskSql();

    const createOrderSpy = mockCreateOrder();
    renderWithThemeAndRouter(<CreateOrder />);
    await act(async () => jest.advanceTimersByTime(3000));

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
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceSchema'));

    await act(async () => jest.advanceTimersByTime(0));

    const schemaOptions = screen.getAllByText('schema1');
    const schema = schemaOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schema);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(screen.getByText('order.createOrder.button'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('order.createOrder.mustAuditTips')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.createOrder.button'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(createOrderSpy).toBeCalledTimes(1);
    expect(screen.getByText('order.createOrder.button').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(createOrderSpy).toBeCalledWith({
      desc: Array.from({ length: orderDescMaxLength }, () => 'e').join(''),
      task_ids: [taskInfo.task_id],
      workflow_subject: 'orderName',
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('order.createOrder.button').parentNode
    ).not.toHaveClass('ant-btn-loading');

    expect(getBySelector('.ant-modal-wrap')).toMatchSnapshot();

    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    fireEvent.click(screen.getByText('common.resetAndClose'));

    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).toBeCalledWith(EmitterKey.Reset_Create_Order_Form);
    expect(emitSpy).toBeCalledWith(EmitterKey.Reset_Upload_Type_Content);
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
    expect(screen.getByLabelText('order.baseInfo.name')).toHaveValue('');
  });

  test('should show tips of unsave sql when form have dirty data at click create order', async () => {
    mockCreateAuditTasks();
    mockAuditTaskGroupId();
    mockGetInstanceWorkflowTemplate();
    mockGetTaskSql();
    renderWithThemeAndRouter(<CreateOrder />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: 'orderName' },
    });
    fireEvent.input(screen.getByLabelText('order.baseInfo.describe'), {
      target: { value: 'order describe' },
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceSchema'));

    await act(async () => jest.advanceTimersByTime(0));

    const schemaOptions = screen.getAllByText('schema1');
    const schema = schemaOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schema);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });

    fireEvent.click(screen.getByText('order.createOrder.button'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('order.createOrder.dirtyDataTips')
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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getInstanceWorkflowTemplate).toBeCalledTimes(0);
    expect(createAuditTasksSpy).toBeCalledTimes(0);
    expect(createOrderSpy).toBeCalledTimes(0);

    fireEvent.input(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: 'orderName' },
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    fireEvent.click(instance);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getInstanceWorkflowTemplate).toBeCalledTimes(1);
    expect(createAuditTasksSpy).toBeCalledTimes(1);
    expect(auditTasksGroupIdSpy).toBeCalledTimes(1);

    expect(
      screen.getByText('order.createOrder.button').closest('button')
    ).toBeDisabled();

    fireEvent.click(screen.getByText('order.createOrder.button'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(createOrderSpy).toBeCalledTimes(0);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });
    expect(
      screen.getByText('order.createOrder.button').closest('button')
    ).toBeDisabled();

    auditTasksGroupIdSpy.mockImplementation(() =>
      resolveThreeSecond({
        task_group_id: 11,
        tasks: [taskInfo],
      })
    );
    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('order.createOrder.button').closest('button')
    ).not.toBeDisabled();

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });
    expect(
      screen.getByText('order.createOrder.button').closest('button')
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
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: 'orderName' },
    });

    fireEvent.mouseDown(screen.getByLabelText('order.sqlInfo.instanceName'));
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    fireEvent.click(instance);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.createOrder.button'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(createOrderSpy).toBeCalledTimes(0);

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table3' },
    });
    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.createOrder.button'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(createOrderSpy).toBeCalledTimes(0);
    expect(
      screen.getByText('order.createOrder.mustHaveAuditResultTips')
    ).toBeInTheDocument();
  });

  test('should generate order name after user select a data source when user do not input order name', async () => {
    renderWithThemeAndRouter(<CreateOrder />);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('order.sqlInfo.instanceName', 'instance1', 1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByLabelText('order.baseInfo.name')).toHaveValue(
      'instance1_19700101010101'
    );
  });

  test('should check workflow name with regex', async () => {
    const check = workflowNameRule();
    let message = '';
    try {
      await check({} as any, '测试数据源', {} as any);
    } catch (error) {
      message = error as any as string;
    }
    expect(message).toBe('');

    try {
      await check({} as any, 'orderName', {} as any);
    } catch (error) {
      message = error as any as string;
    }
    expect(message).toBe('');

    try {
      await check({} as any, '测试数据源_123456-orderName', {} as any);
    } catch (error) {
      message = error as any as string;
    }
    expect(message).toBe('');

    try {
      await check({} as any, '123456', {} as any);
    } catch (error) {
      message = error as any as string;
    }
    expect(message).toBe('common.form.rule.startWithWords');
    message = '';

    try {
      await check({} as any, '_123测试数据源', {} as any);
    } catch (error) {
      message = error as any as string;
    }
    expect(message).toBe('common.form.rule.startWithWords');

    try {
      await check({} as any, '测试数据源_123456-orderName*', {} as any);
    } catch (error) {
      message = error as any as string;
    }
    expect(message).toBe('order.createOrder.workflowNameRule');
  });

  test('should render result modal when created order', async () => {
    mockCreateAuditTasks();
    mockAuditTaskGroupId();
    mockGetInstanceWorkflowTemplate();
    mockGetTaskSql();

    const createOrderSpy = mockCreateOrder();
    createOrderSpy.mockImplementation(() =>
      resolveThreeSecond({
        workflow_id: '123',
      })
    );
    const { container } = renderWithThemeAndRouter(<CreateOrder />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: 'orderName' },
    });

    selectOptionByIndex('order.sqlInfo.instanceName', 'instance1');
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.input(screen.getByLabelText('order.sqlInfo.sql'), {
      target: { value: 'select * from table2' },
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.createOrder.button'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(createOrderSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    await screen.findAllByText('order.create.success');

    expect(getHrefByText('order.create.guide >')).toBe(
      `/project/${projectName}/order/123`
    );

    fireEvent.click(screen.getByText('order.create.cloneOrder'));
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
    expect(screen.getByLabelText('order.baseInfo.name')).toHaveTextContent('');

    fireEvent.input(screen.getByLabelText('order.baseInfo.name'), {
      target: { value: 'orderName2' },
    });

    fireEvent.click(screen.getByText('order.sqlInfo.audit'));
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('order.createOrder.button'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(createOrderSpy).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('common.resetAndClose'));
    expect(container).toMatchSnapshot();
  });
});
