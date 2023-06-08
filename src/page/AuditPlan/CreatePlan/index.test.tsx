import { fireEvent, screen, act } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import CreateAuditPlan from '.';
import audit_plan from '../../../api/audit_plan';
import instance from '../../../api/instance';
import EmitterKey from '../../../data/EmitterKey';
import {
  getBySelector,
  getHrefByText,
  selectOptionByIndex,
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
import { dataSourceInstance } from '../../DataSource/__testData__';
import { auditTaskMetas } from '../PlanForm/__testData__/auditMeta';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = 'default';

describe('CreatePlan', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

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
    useParamsMock.mockReturnValue({ projectName });
    mockDriver();
    mockUseInstance();
    mockUseInstanceSchema();
    mockGetInstance();
    mockUseRuleTemplate();
    mockUseGlobalRuleTemplate();
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

  const mockCreateAuditPlan = () => {
    const spy = jest.spyOn(audit_plan, 'createAuditPlanV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  const mockGetAuditMeta = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlanMetasV1');
    spy.mockImplementation(() => resolveThreeSecond(auditTaskMetas));
    return spy;
  };

  test('should send create audit plan request', async () => {
    const createRequest = mockCreateAuditPlan();
    const { container } = renderWithRouter(<CreateAuditPlan />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('auditPlan.planForm.name'), {
      target: { value: 'planName1' },
    });

    await act(async () => jest.advanceTimersByTime(0));

    selectOptionByIndex('auditPlan.planForm.databaseName', 'instance1');
    await act(async () => jest.advanceTimersByTime(0));

    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('auditPlan.planForm.schema', 'schema1');
    await act(async () => jest.advanceTimersByTime(0));

    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('auditPlan.planForm.taskType', '普通的SQL审核', 0);
    await act(async () => jest.advanceTimersByTime(0));

    selectOptionByIndex(
      'auditPlan.planForm.ruleTemplateName',
      'rule_template_name1'
    );
    await act(async () => jest.advanceTimersByTime(0));

    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });

    await act(async () => jest.advanceTimersByTime(0));

    expect(createRequest).toBeCalledTimes(1);
    expect(createRequest).toBeCalledWith({
      project_name: projectName,
      audit_plan_cron: '0 0 * * *',
      audit_plan_instance_database: 'schema1',
      audit_plan_instance_name: 'instance1',
      audit_plan_instance_type: 'mysql',
      audit_plan_name: 'planName1',
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
      audit_plan_type: 'normal',
      rule_template_name: 'rule_template_name1',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(screen.getByText('common.operateSuccess')).toBeInTheDocument();
    expect(getHrefByText('auditPlan.create.successGuide >')).toBe(
      `/project/${projectName}/auditPlan/detail/planName1`
    );

    fireEvent.click(screen.getByText('auditPlan.create.clonePlan'));
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
    expect(screen.getByLabelText('auditPlan.planForm.name')).toHaveValue('');
    expect(container).toMatchSnapshot();

    fireEvent.input(screen.getByLabelText('auditPlan.planForm.name'), {
      target: { value: 'planName2' },
    });

    act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });

    await act(async () => jest.advanceTimersByTime(0));

    expect(createRequest).toBeCalledTimes(2);
    expect(createRequest).nthCalledWith(2, {
      project_name: projectName,
      audit_plan_cron: '0 0 * * *',
      audit_plan_instance_database: 'schema1',
      audit_plan_instance_name: 'instance1',
      audit_plan_instance_type: 'mysql',
      audit_plan_name: 'planName2',
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
      audit_plan_type: 'normal',
      rule_template_name: 'rule_template_name1',
    });
    await act(async () => jest.advanceTimersByTime(3000));

    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    fireEvent.click(screen.getByText('common.resetAndClose'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(emitSpy).toBeCalledTimes(2);
    expect(emitSpy).toBeCalledWith(EmitterKey.Rest_Audit_Plan_Form);
    expect(emitSpy).toBeCalledWith(
      EmitterKey.Reset_Audit_Plan_Form_Instance_List
    );

    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
  });
});
