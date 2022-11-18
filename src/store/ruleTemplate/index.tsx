import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProjectRuleTemplateResV1 } from '../../api/common';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';

type RuleTemplateListState = {
  selectRuleTemplate: null | IProjectRuleTemplateResV1;
  modalStatus: ModalStatus;
};

const initialState: RuleTemplateListState = {
  selectRuleTemplate: null,
  modalStatus: {},
};

const ruleTemplate = createSlice({
  name: 'ruleTemplate',
  initialState,
  reducers: {
    updateSelectRuleTemplate(
      state,
      {
        payload: { ruleTemplate },
      }: PayloadAction<{ ruleTemplate: IProjectRuleTemplateResV1 | null }>
    ) {
      state.selectRuleTemplate = ruleTemplate;
    },
    ...commonModalReducer(),
  },
});

export const {
  updateSelectRuleTemplate,
  updateModalStatus: updateRuleTemplateListModalStatus,
  initModalStatus: initRuleTemplateListModalStatus,
} = ruleTemplate.actions;

export default ruleTemplate.reducer;
