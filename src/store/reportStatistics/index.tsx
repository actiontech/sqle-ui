import { createSlice } from '@reduxjs/toolkit';

type ReportStatisticsState = {
  refreshFlag: boolean;
};

const initialState: ReportStatisticsState = {
  refreshFlag: false,
};

const reportStatistics = createSlice({
  name: 'reportStatistics',
  initialState,
  reducers: {
    refreshReportStatistics(state) {
      state.refreshFlag = !state.refreshFlag;
    },
  },
});

export const { refreshReportStatistics } = reportStatistics.actions;

export default reportStatistics.reducer;
