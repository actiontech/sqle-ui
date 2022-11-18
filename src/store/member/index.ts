import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IGetMemberGroupRespDataV1,
  IGetMemberRespDataV1,
} from '../../api/common';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';

type MemberReduxState = {
  modalStatus: ModalStatus;
  selectMember: IGetMemberRespDataV1 | null;
  selectMemberGroup: IGetMemberGroupRespDataV1 | null;
};

const initialState: MemberReduxState = {
  selectMember: null,
  selectMemberGroup: null,
  modalStatus: {},
};

const member = createSlice({
  name: 'member',
  initialState,
  reducers: {
    updateSelectMember(
      state,
      {
        payload: { member },
      }: PayloadAction<{ member: IGetMemberRespDataV1 | null }>
    ) {
      state.selectMember = member;
    },
    updateSelectMemberGroup(
      state,
      {
        payload: { memberGroup },
      }: PayloadAction<{ memberGroup: IGetMemberGroupRespDataV1 | null }>
    ) {
      state.selectMemberGroup = memberGroup;
    },
    ...commonModalReducer(),
  },
});

export const {
  updateSelectMember,
  updateSelectMemberGroup,
  initModalStatus: initMemberModalStatus,
  updateModalStatus: updateMemberModalStatus,
} = member.actions;

export default member.reducer;
