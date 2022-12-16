import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuditPlanResV2 } from '../../api/common';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';
type AuditPlanReduxState = {
  modalStatus: ModalStatus;
  selectAuditPlan: IAuditPlanResV2 | null;
};

const initialState: AuditPlanReduxState = {
  modalStatus: {},
  selectAuditPlan: null,
};
const auditPlan = createSlice({
  name: 'auditPlan',
  initialState,
  reducers: {
    ...commonModalReducer(),
    updateSelectAuditPlan: (
      state,
      { payload: selectedData }: PayloadAction<IAuditPlanResV2 | null>
    ) => {
      state.selectAuditPlan = selectedData;
    },
  },
});
export const {
  initModalStatus: initAuditPlanModalStatus,
  updateModalStatus: updateAuditPlanModalStatus,
  updateSelectAuditPlan,
} = auditPlan.actions;

export default auditPlan.reducer;
