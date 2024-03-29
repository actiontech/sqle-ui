import { fireEvent, waitFor, screen, act } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import { useParams } from 'react-router-dom';
import UpdateAuditPlan from '.';
import audit_plan from '../../../api/audit_plan';
import { getInstanceTipListV1FunctionalModuleEnum } from '../../../api/instance/index.enum';
import EmitterKey from '../../../data/EmitterKey';
import {
  getAllBySelector,
  getBySelector,
  getHrefByText,
  getSelectValueByFormLabel,
} from '../../../testUtils/customQuery';
import { renderWithRouter } from '../../../testUtils/customRender';
import {
  mockDriver,
  mockUseGlobalRuleTemplate,
  mockUseInstance,
  mockUseInstanceSchema,
  mockUseRuleTemplate,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { auditTaskMetas } from '../PlanForm/__testData__/auditMeta';
import { AuditPlan } from '../PlanList/__testData__';
jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
  };
});
describe('UpdateAuditPlan', () => {
  let warningSpy!: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const projectName = 'default';
  let useInstanceSpy!: jest.SpyInstance;
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
    useParamsMock.mockReturnValue({
      auditPlanName: 'auditPlanName1',
      projectName,
    });
    mockDriver();
    useInstanceSpy = mockUseInstance();
    mockUseInstanceSchema();
    mockGetAuditPlan();
    mockGetAuditMeta();
    mockUseRuleTemplate();
    mockUseGlobalRuleTemplate();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    warningSpy.mockRestore();
  });

  const mockGetAuditPlan = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanV1');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlan));
    return spy;
  };

  const mockUpdateAuditPlan = () => {
    const spy = jest.spyOn(audit_plan, 'updateAuditPlanV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockGetAuditMeta = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanMetasV1');
    spy.mockImplementation(() => resolveThreeSecond(auditTaskMetas));
    return spy;
  };

  test('should set form default value to specify instance', async () => {
    const { container } = renderWithRouter(<UpdateAuditPlan />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should send update audit plan request when user input all files and click submit', async () => {
    const updateSpy = mockUpdateAuditPlan();
    const getAuditPlanSpy = mockGetAuditPlan();
    const { container } = renderWithRouter(<UpdateAuditPlan />);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(useInstanceSpy).toBeCalledWith({
      project_name: projectName,
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_audit_plan,
    });

    fireEvent.mouseDown(screen.getByLabelText('auditPlan.planForm.schema'));
    await act(async () => jest.advanceTimersByTime(0));

    const schemaOptions = screen.getAllByText('schema1');
    expect(schemaOptions[1]).toHaveClass('ant-select-item-option-content');
    fireEvent.click(schemaOptions[1]);

    fireEvent.mouseDown(
      screen.getByLabelText('auditPlan.planForm.ruleTemplateName')
    );
    await act(async () => jest.advanceTimersByTime(0));

    const ruleTemplateOptions = screen.getAllByText('rule_template_name1');
    fireEvent.click(ruleTemplateOptions[0]);

    fireEvent.click(screen.getByText('字段c'));

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledWith({
      project_name: projectName,
      audit_plan_cron: '* * * * *',
      audit_plan_instance_database: 'schema1',
      audit_plan_instance_name: 'db1',
      audit_plan_name: 'auditPlanName1',
      rule_template_name: 'rule_template_name1',
      audit_plan_params: [
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
          value: 'false',
        },
      ],
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('auditPlan.update.successGuide >')
    ).toBeInTheDocument();
    expect(getHrefByText('auditPlan.update.successGuide >')).toBe(
      `/project/${projectName}/auditPlan/detail/auditPlanName1`
    );

    expect(container).toMatchSnapshot();
    expect(getAuditPlanSpy).toBeCalledTimes(1);
    getAuditPlanSpy.mockImplementation(() =>
      resolveThreeSecond(cloneDeep(AuditPlan))
    );
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    fireEvent.click(screen.getByText('common.close'));

    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).toBeCalledWith(EmitterKey.Rest_Audit_Plan_Form);
    expect(emitSpy).toBeCalledWith(
      EmitterKey.Reset_Audit_Plan_Form_Instance_List
    );
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(getAuditPlanSpy).toBeCalledTimes(2);
    expect(screen.getByLabelText('auditPlan.planForm.name')).toHaveValue('');
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByLabelText('auditPlan.planForm.name')).toHaveValue(
      'audit_for_java_app20'
    );
    expect(
      getSelectValueByFormLabel('auditPlan.planForm.taskType')
    ).toHaveTextContent('普通的SQL审核');

    fireEvent.mouseDown(
      screen.getByLabelText('auditPlan.planForm.databaseName')
    );

    fireEvent.mouseDown(getAllBySelector('.ant-select-clear')[0]!);

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('common.submit'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateSpy).toBeCalledTimes(2);
    expect(updateSpy).nthCalledWith(2, {
      project_name: projectName,
      audit_plan_cron: '* * * * *',
      audit_plan_instance_database: '',
      audit_plan_instance_name: '',
      audit_plan_name: 'auditPlanName1',
      rule_template_name: 'rule_template_name1',
      audit_plan_params: [
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
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
