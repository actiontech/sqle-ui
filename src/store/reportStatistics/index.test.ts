import reducers, { refreshReportStatistics } from '.';

describe('store/reportStatistics', () => {
  test('should create action', () => {
    expect(refreshReportStatistics()).toEqual({
      type: 'reportStatistics/refreshReportStatistics',
    });
  });

  test('should update refresh flag when dispatch refreshReportStatistics action', () => {
    const state = { refreshFlag: false };
    const newState = reducers(state, refreshReportStatistics());
    expect(newState.refreshFlag).toBe(!state.refreshFlag);
  });
});
