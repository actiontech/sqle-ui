import { fireEvent, render, screen, act } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import PlanForm from '.';
import audit_plan from '../../../api/audit_plan';
import { IAuditPlanResV1 } from '../../../api/common';
import instance from '../../../api/instance';
import EmitterKey from '../../../data/EmitterKey';
import { getBySelector } from '../../../testUtils/customQuery';
import {
  mockDriver,
  mockUseGlobalRuleTemplate,
  mockUseInstance,
  mockUseInstanceSchema,
  mockUseRuleTemplate,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { dataSourceInstance } from '../../DataSource/__testData__';
import { AuditPlan } from '../PlanList/__testData__';
import { auditTaskMetas } from './__testData__/auditMeta';

describe('PlanForm', () => {
  let warningSpy!: jest.SpyInstance;
  let useInstanceSpy!: jest.SpyInstance;
  let useRuleTemplateSpy!: jest.SpyInstance;
  let useGlobalRuleTemplateSpy!: jest.SpyInstance;
  const projectName = 'default';
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
    useInstanceSpy = mockUseInstance();
    mockUseInstanceSchema();
    mockGetInstance();
    mockGetAuditMeta();
    useRuleTemplateSpy = mockUseRuleTemplate();
    useGlobalRuleTemplateSpy = mockUseGlobalRuleTemplate();
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
    const { container } = render(
      <PlanForm submit={submitFn} projectName={projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should set db type to equal data source which user select', async () => {
    const submitFn = jest.fn();
    const getInstanceSpy = mockGetInstance();
    render(<PlanForm submit={submitFn} projectName={projectName} />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      screen.getByLabelText('auditPlan.planForm.databaseName')
    );
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);

    expect(getInstanceSpy).toBeCalledTimes(1);
    expect(getInstanceSpy).toBeCalledWith({
      instance_name: 'instance1',
      project_name: projectName,
    });

    await act(async () => jest.advanceTimersByTime(3000));

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
    const { container } = render(
      <PlanForm submit={submitFn} projectName={projectName} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('auditPlan.planForm.name'), {
      target: { value: 'planName1' },
    });

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(
      screen.getByLabelText('auditPlan.planForm.databaseName')
    );
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    expect(instance).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instance);
    await act(async () => jest.advanceTimersByTime(0));

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('auditPlan.planForm.schema'));
    await act(async () => jest.advanceTimersByTime(0));

    const schemaOptions = screen.getAllByText('schema1');
    expect(schemaOptions[1]).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schemaOptions[1]);
    await act(async () => jest.advanceTimersByTime(0));

    expect(getAuditMetasSpy).toBeCalledTimes(1);
    expect(getAuditMetasSpy).toBeCalledWith({
      filter_instance_type: 'mysql',
    });

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('auditPlan.planForm.taskType'));
    await act(async () => jest.advanceTimersByTime(0));

    const auditTaskTypeOptions = screen.getAllByText('普通的SQL审核');
    expect(auditTaskTypeOptions[0]).toHaveClass(
      'ant-select-item-option-content'
    );
    fireEvent.click(auditTaskTypeOptions[0]);

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(
      screen.getByLabelText('auditPlan.planForm.ruleTemplateName')
    );
    await act(async () => jest.advanceTimersByTime(0));

    const ruleTemplateOptions = screen.getAllByText('rule_template_name1');
    fireEvent.click(ruleTemplateOptions[1]);

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.reset').parentNode).toBeDisabled();

    expect(submitFn).toBeCalledTimes(1);
    expect(submitFn).toBeCalledWith({
      cron: '0 0 * * *',
      databaseName: 'instance1',
      dbType: 'mysql',
      name: 'planName1',
      schema: 'schema1',
      asyncParams: [
        {
          key: 'a',
          value: '123',
        },
        {
          key: 'b',
          value: '123',
        },
        {
          key: 'c',
          value: 'true',
        },
      ],
      auditTaskType: 'normal',
      ruleTemplateName: 'rule_template_name1',
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.reset').parentNode).not.toBeDisabled();

    await fireEvent.click(screen.getByText('common.reset'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });

  test('should rest form when component "Rest_Audit_Plan_Form" event', async () => {
    const submitFn = jest.fn();
    render(<PlanForm submit={submitFn} projectName={projectName} />);
    await fireEvent.input(screen.getByLabelText('auditPlan.planForm.name'), {
      target: { value: 'planName1' },
    });
    await act(() => {
      EventEmitter.emit(EmitterKey.Rest_Audit_Plan_Form);
    });
    expect(screen.getByLabelText('auditPlan.planForm.name')).toHaveValue('');
  });

  test('should reset apart of form when props includes default values and user click reset button', async () => {
    const submitFn = jest.fn();
    const emitSpy = jest.spyOn(EventEmitter, 'emit');

    const { container } = render(
      <PlanForm
        submit={submitFn}
        defaultValue={AuditPlan as IAuditPlanResV1}
        projectName={projectName}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(useInstanceSpy).toBeCalledTimes(1);
    expect(useInstanceSpy).toBeCalledWith({
      filter_db_type: 'oracle',
      functional_module: 'create_audit_plan',
      project_name: projectName,
    });
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('common.reset'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(
      EmitterKey.Reset_Audit_Plan_Form_Instance_List
    );

    expect(container).toMatchSnapshot();
    emitSpy.mockClear();
  });

  test('should reset all field to new task field after user update audit task and stay this page', async () => {
    const submitFn = jest.fn();
    const getMeta = mockGetAuditMeta();
    const { rerender } = render(
      <PlanForm
        submit={submitFn}
        defaultValue={AuditPlan as IAuditPlanResV1}
        projectName={projectName}
      />
    );
    expect(getMeta).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    const auditPlanClone = cloneDeep(AuditPlan);
    rerender(
      <PlanForm
        submit={submitFn}
        defaultValue={auditPlanClone as IAuditPlanResV1}
        projectName={projectName}
      />
    );
    expect(getMeta).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText(AuditPlan.audit_plan_meta.audit_plan_type_desc)
    ).toHaveClass('ant-select-selection-item');
  });

  test('should be rendered rule template name select form item when data source type is selected', async () => {
    const submitFn = jest.fn();
    expect(useRuleTemplateSpy).toBeCalledTimes(0);
    expect(useGlobalRuleTemplateSpy).toBeCalledTimes(0);
    render(<PlanForm submit={submitFn} projectName={projectName} />);
    expect(useRuleTemplateSpy).toBeCalledTimes(1);
    expect(useRuleTemplateSpy).toBeCalledWith({ project_name: projectName });
    expect(useGlobalRuleTemplateSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('auditPlan.planForm.ruleTemplateName')?.parentElement
        ?.parentElement?.parentElement
    ).toHaveClass('ant-form-item-hidden');

    fireEvent.mouseDown(
      screen.getByLabelText('auditPlan.planForm.databaseName')
    );
    await act(async () => jest.advanceTimersByTime(0));

    const instanceOptions = screen.getAllByText('instance1');
    const instance = instanceOptions[1];
    fireEvent.click(instance);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('auditPlan.planForm.ruleTemplateName')?.parentElement
        ?.parentElement?.parentElement
    ).not.toHaveClass('ant-form-item-hidden');
  });

  test('should empty rule template name when changing database type', async () => {
    const submitFn = jest.fn();
    render(<PlanForm submit={submitFn} projectName={projectName} />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('auditPlan.planForm.dbType'));
    await act(async () => jest.advanceTimersByTime(0));

    const mysqlOptions = screen.getAllByText('mysql');
    const mysql = mysqlOptions[1];
    fireEvent.click(mysql);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(
      screen.getByLabelText('auditPlan.planForm.ruleTemplateName')
    );
    await act(async () => jest.advanceTimersByTime(0));

    const ruleTemplateOptions = screen.getAllByText('rule_template_name1');
    fireEvent.click(ruleTemplateOptions[1]);

    expect(screen.getAllByText('rule_template_name1')[0]).toHaveClass(
      'ant-select-selection-item'
    );

    fireEvent.mouseDown(screen.getByLabelText('auditPlan.planForm.dbType'));
    await act(async () => jest.advanceTimersByTime(0));

    const oracleOptions = screen.getAllByText('oracle');
    const oracle = oracleOptions[1];
    fireEvent.click(oracle);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getAllByText('rule_template_name1')[0]).not.toHaveClass(
      'ant-select-selection-item'
    );
  });

  test('should filter instance when changing database type', async () => {
    const submitFn = jest.fn();
    render(<PlanForm submit={submitFn} projectName={projectName} />);

    expect(useInstanceSpy).toBeCalledTimes(1);
    expect(useInstanceSpy).toBeCalledWith({
      functional_module: 'create_audit_plan',
      project_name: projectName,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(screen.getByLabelText('auditPlan.planForm.dbType'));
    await act(async () => jest.advanceTimersByTime(0));

    const mysqlOptions = screen.getAllByText('mysql');
    const mysql = mysqlOptions[1];
    fireEvent.click(mysql);
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(useInstanceSpy).toBeCalledTimes(2);
    expect(useInstanceSpy).toBeCalledWith({
      filter_db_type: 'mysql',
      functional_module: 'create_audit_plan',
      project_name: projectName,
    });
  });
});
