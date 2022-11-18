import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRuleTemplateResV1 } from '../../api/common';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';

type GlobalRuleTemplateListState = {
  selectGlobalRuleTemplate: null | IRuleTemplateResV1;
  modalStatus: ModalStatus;
};

const initialState: GlobalRuleTemplateListState = {
  selectGlobalRuleTemplate: null,
  modalStatus: {},
};

const globalRuleTemplate = createSlice({
  name: 'globalRuleTemplate',
  initialState,
  reducers: {
    updateGlobalSelectRuleTemplate(
      state,
      {
        payload: { ruleTemplate },
      }: PayloadAction<{ ruleTemplate: IRuleTemplateResV1 | null }>
    ) {
      state.selectGlobalRuleTemplate = ruleTemplate;
    },
    ...commonModalReducer(),
  },
});

export const {
  updateGlobalSelectRuleTemplate,
  updateModalStatus: updateGlobalRuleTemplateListModalStatus,
  initModalStatus: initGlobalRuleTemplateListModalStatus,
} = globalRuleTemplate.actions;

export default globalRuleTemplate.reducer;
