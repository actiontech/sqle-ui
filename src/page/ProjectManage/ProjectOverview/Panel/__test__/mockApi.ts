import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '../../../../../api/common.enum';
import statistic from '../../../../../api/statistic';
import workflow from '../../../../../api/workflow';
import { resolveThreeSecond } from '../../../../../testUtils/mockRequest';

export const mockGetProjectScore = () => {
  const spy = jest.spyOn(statistic, 'GetProjectScoreV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      score: 85,
    })
  );
  return spy;
};

export const mockStatisticsAuditedSQL = () => {
  const spy = jest.spyOn(statistic, 'statisticsAuditedSQLV1');
  spy.mockImplementation(() =>
    resolveThreeSecond(
      {
        risk_sql_count: 420,
        total_sql_count: 1200,
      },
      { otherData: { risk_rate: 35 } }
    )
  );

  return spy;
};

export const mockGetInstanceHealth = () => {
  const spy = jest.spyOn(statistic, 'GetInstanceHealthV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        db_type: 'MySQL',
        health_instance_names: ['mysql-1', 'mysql-2', 'mysql-3'],
        unhealth_instance_names: ['mysql-4', 'mysql-5', 'mysql-6', 'mysql-7'],
      },
      {
        db_type: 'Oracle',
        health_instance_names: ['oracle-1', 'oracle-2', 'oracle-3'],
        unhealth_instance_names: ['oracle-4', 'oracle-5'],
      },
      {
        db_type: 'DB2',
        health_instance_names: ['db-1', 'db-2', 'db-3', 'db-4'],
        unhealth_instance_names: ['db-5', 'db-6'],
      },
    ])
  );
  return spy;
};

export const mockStatisticWorkflowStatus = () => {
  const spy = jest.spyOn(statistic, 'statisticWorkflowStatusV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      waiting_for_audit_count: 32,
      waiting_for_execution_count: 0,
      execution_success_count: 20,
      executing_failed_count: 11,
      rejected_count: 33,
      closed_count: 10,
    })
  );
  return spy;
};

export const mockStatisticRiskWorkflow = () => {
  const spy = jest.spyOn(statistic, 'statisticRiskWorkflowV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        create_user_name: 'admin',
        update_time: '2022-06-09T08:11:52+08:00',
        workflow_id: '123',
        workflow_name: 'test',
        workflow_status: 'exec_failed',
      },
    ])
  );
  return spy;
};

export const mockStatisticAuditPlan = () => {
  const spy = jest.spyOn(statistic, 'statisticAuditPlanV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        data: [
          {
            audit_plan_count: 1,
            audit_plan_type: 'type1',
            audit_plan_desc: 'desc1',
          },
          {
            audit_plan_count: 3,
            audit_plan_type: 'type2',
            audit_plan_desc: 'desc2',
          },
        ],
        db_type: 'MySQL',
      },
      {
        data: [
          {
            audit_plan_count: 2,
            audit_plan_type: 'type1',
            audit_plan_desc: 'desc1',
          },
          {
            audit_plan_count: 1,
            audit_plan_type: 'type2',
            audit_plan_desc: 'desc2',
          },
        ],
        db_type: 'Oracle',
      },
    ])
  );
  return spy;
};

export const mockGetRiskAuditPlan = () => {
  const spy = jest.spyOn(statistic, 'getRiskAuditPlanV1');

  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        audit_plan_name: 'name',
        audit_plan_report_id: '1',
        audit_plan_report_timestamp: '2022-06-09T08:11:52+08:00',
        risk_sql_count: 33,
        trigger_audit_plan_time: '2022-06-09T08:11:52+08:00',
      },
    ])
  );
  return spy;
};

export const mockGetRoleUserCount = () => {
  const spy = jest.spyOn(statistic, 'getRoleUserCountV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        count: 12,
        role: 'dev',
      },
      {
        count: 22,
        role: 'dba',
      },
    ])
  );
  return spy;
};

export const mockGetWorkflowTemplateV1 = () => {
  const spy = jest.spyOn(workflow, 'getWorkflowTemplateV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      allow_submit_when_less_audit_level:
        WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
      desc: 'mock test data',
      instance_name_list: ['test'],
      workflow_template_name: 'test',
      workflow_step_template_list: [
        {
          number: 1,
          type: 'sql_review',
          approved_by_authorized: true,
          execute_by_authorized: false,
          assignee_user_name_list: [],
        },
        {
          number: 2,
          type: 'sql_review',
          approved_by_authorized: true,
          execute_by_authorized: false,
          assignee_user_name_list: [],
        },
        {
          number: 3,
          type: 'sql_execute',
          approved_by_authorized: false,
          execute_by_authorized: false,
          assignee_user_name_list: ['admin'],
        },
      ],
    })
  );

  return spy;
};
