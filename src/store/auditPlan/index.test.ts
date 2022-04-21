import reducers, { updateSelectAuditPlan } from '.';
import { IReduxState } from '..';
import { AuditPlanList } from '../../page/AuditPlan/PlanList/__testData__';

describe('store/auditPlan', () => {
  test('should create action', () => {
    expect(updateSelectAuditPlan(null)).toEqual({
      payload: null,
      type: 'auditPlan/updateSelectAuditPlan',
    });
    expect(updateSelectAuditPlan(AuditPlanList[0])).toEqual({
      payload: {
        audit_plan_cron: '0 */2 * * *',
        audit_plan_db_type: 'mysql',
        audit_plan_instance_database: 'sqle',
        audit_plan_instance_name: 'db1',
        audit_plan_meta: {
          audit_plan_params: [],
          audit_plan_type: 'audit_for_java_app',
          audit_plan_type_desc: '审核java应用',
          instance_type: 'mysql',
        },
        audit_plan_name: 'audit_for_java_app11',
        audit_plan_token:
          'wkpjrnbuneufaljqxijggisjedhpwlhippscklduloxbgymgvwkvhuurmyjiqbaiufvadmkncenueesmbqjqeudkbqdhvihiwzrsdrqbluhashusgzemonxivbsrz',
      },
      type: 'auditPlan/updateSelectAuditPlan',
    });
  });

  const state: IReduxState['auditPlan'] = {
    modalStatus: {},
    selectAuditPlan: null,
  };

  test('should update select data when dispatch updateSelectAuditPlan action', () => {
    const newState = reducers(state, updateSelectAuditPlan(AuditPlanList[0]));
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      selectAuditPlan: AuditPlanList[0],
    });
  });
});
