import { waitFor, fireEvent, screen } from '@testing-library/react';
import CreateAuditPlan from '.';
import audit_plan from '../../../api/audit_plan';
import instance from '../../../api/instance';
import EmitterKey from '../../../data/EmitterKey';
import { getBySelector } from '../../../testUtils/customQuery';
import { renderWithRouter } from '../../../testUtils/customRender';
import {
  mockDriver,
  mockUseInstance,
  mockUseInstanceSchema,
  resolveThreeSecond,
} from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { dataSourceInstance } from '../../DataSource/__testData__';
import { auditTaskMetas } from '../PlanForm/__testData__/auditMeta';

describe('CreatePlan', () => {
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

    expect(createRequest).toBeCalledTimes(1);
    expect(createRequest).toBeCalledWith({
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
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(container).toMatchSnapshot();

    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    fireEvent.click(screen.getByText('common.resetAndClose'));

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Rest_Audit_Plan_Form);

    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
  });
});
