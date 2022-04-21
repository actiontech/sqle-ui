import reducers, { updateSelectAuditPlan } from '.';
import { IReduxState } from '..';
import { AuditPlanList } from '../../page/AuditPlan/PlanList/__testData__';
import { SupportTheme } from '../../theme';

describe('store/auditPlan', () => {
  test('should create action', () => {
    expect(updateSelectAuditPlan(null)).toEqual({
      payload: null,
      type: 'user/updateUser',
    });
    expect(updateSelectAuditPlan(AuditPlanList[0])).toEqual({
      payload: {
        theme: SupportTheme.LIGHT,
      },
      type: 'user/updateTheme',
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
