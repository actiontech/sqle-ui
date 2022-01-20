import {
  fireEvent,
  render,
  waitFor,
  screen,
  act,
} from '@testing-library/react';
import PlanForm from '.';
import audit_plan from '../../../api/audit_plan';
import instance from '../../../api/instance';
import EmitterKey from '../../../data/EmitterKey';
import { getBySelector } from '../../../testUtils/customQuery';
import {
  mockDriver,
  mockUseInstance,
  mockUseInstanceSchema,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { dataSourceInstance } from '../../DataSource/__testData__';
import { auditTaskMetas } from './__testData__/auditMeta';

describe('PlanForm', () => {
  let warningSpy!: jest.SpyInstance;
  beforeAll(() => {
    const warning = global.console.warn;
    warningSpy = jest.spyOn(global.console, 'warn');
    warningSpy.mockImplementation((message: string) => {
      if (message.includes('async-validator')) {
        return;
      }
      warning(message);
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
    mockDriver();
    mockUseInstance();
    mockUseInstanceSchema();
    mockGetInstance();
    mockGetAuditMeta();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    warningSpy.mockRestore();
  });

  const mockGetInstance = () => {
    const spy = jest.spyOn(instance, 'getInstanceV1');
    spy.mockImplementation(() => resolveThreeSecond(dataSourceInstance));
    return spy;
  };

  const mockGetAuditMeta = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanMetasV1');
    spy.mockImplementation(() => resolveThreeSecond(auditTaskMetas));
    return spy;
  };

  test('should match snapshot', async () => {
    const submitFn = jest.fn();
    const { container } = render(<PlanForm submit={submitFn} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should set db type to equal data source which user select', async () => {
    const submitFn = jest.fn();
    const getInstanceSpy = mockGetInstance();
    render(<PlanForm submit={submitFn} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.mouseDown(
      screen.getByLabelText('auditPlan.planForm.databaseName')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);

    expect(getInstanceSpy).toBeCalledTimes(1);
    expect(getInstanceSpy).toBeCalledWith({ instance_name: 'instance1' });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      getBySelector(
        '.ant-select-selection-item',
        screen.getByLabelText('auditPlan.planForm.dbType').parentNode
          ?.parentNode as Element
      )
    ).toHaveTextContent('mysql');
  });

  test('should submit form value when user input all required fields and click submit button', async () => {
    const submitFn = jest.fn().mockImplementation(() => resolveThreeSecond({}));
    const getAuditMetasSpy = mockGetAuditMeta();
    const { container } = render(<PlanForm submit={submitFn} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('auditPlan.planForm.name'), {
      target: { value: 'planName1' },
    });

    fireEvent.mouseDown(
      screen.getByLabelText('auditPlan.planForm.databaseName')
    );
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

    fireEvent.mouseDown(screen.getByLabelText('auditPlan.planForm.schema'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const schemaOptions = screen.getAllByText('schema1');
    expect(schemaOptions[1]).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schemaOptions[1]);

    expect(getAuditMetasSpy).toBeCalledTimes(1);
    expect(getAuditMetasSpy).toBeCalledWith({
      filter_instance_type: 'mysql',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.mouseDown(screen.getByLabelText('auditPlan.planForm.taskType'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const auditTaskTypeOptions = screen.getAllByText('普通的SQL审核');
    expect(auditTaskTypeOptions[0]).toHaveClass(
      'ant-select-item-option-content'
    );
    fireEvent.click(auditTaskTypeOptions[0]);

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
    expect(screen.getByText('common.reset').parentNode).toBeDisabled();

    expect(submitFn).toBeCalledTimes(1);
    expect(submitFn).toBeCalledWith({
      cron: '* * * * *',
      databaseName: 'instance1',
      dbType: 'mysql',
      name: 'planName1',
      schema: 'schema1',
      asyncParams: [
        {
          desc: '字段a',
          key: 'a',
          type: 'string',
          value: '123',
        },
        {
          desc: '字段b',
          key: 'b',
          type: 'int',
          value: '123',
        },
        {
          desc: '字段c',
          key: 'c',
          type: 'bool',
          value: 'true',
        },
      ],
      auditTaskType: 'normal',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.reset').parentNode).not.toBeDisabled();

    fireEvent.click(screen.getByText('common.reset'));

    expect(container).toMatchSnapshot();
  });

  test('should reset apart of form when props includes default values and user click reset button', async () => {
    const submitFn = jest.fn();
    const { container } = render(<PlanForm submit={submitFn} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.reset'));

    expect(container).toMatchSnapshot();
  });

  test('should rest form when component "Rest_Audit_Plan_Form" event', async () => {
    const submitFn = jest.fn();
    render(<PlanForm submit={submitFn} />);
    fireEvent.input(screen.getByLabelText('auditPlan.planForm.name'), {
      target: { value: 'planName1' },
    });
    act(() => {
      EventEmitter.emit(EmitterKey.Rest_Audit_Plan_Form);
    });
    expect(screen.getByLabelText('auditPlan.planForm.name')).toHaveValue('');
  });
});
