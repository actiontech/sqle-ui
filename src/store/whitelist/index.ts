import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuditWhitelistResV1 } from '../../api/common.d';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';

type WhitelistReduxState = {
  modalStatus: ModalStatus;
  selectWhitelist: IAuditWhitelistResV1 | null;
};

const initialState: WhitelistReduxState = {
  selectWhitelist: null,
  modalStatus: {},
};

const whitelist = createSlice({
  name: 'whitelist',
  initialState,
  reducers: {
    updateSelectWhitelist(
      state,
      {
        payload: { whitelist },
      }: PayloadAction<{ whitelist: IAuditWhitelistResV1 | null }>
    ) {
      state.selectWhitelist = whitelist;
    },
    ...commonModalReducer(),
  },
});

export const {
  updateSelectWhitelist,
  initModalStatus: initWhitelistModalStatus,
  updateModalStatus: updateWhitelistModalStatus,
} = whitelist.actions;

export default whitelist.reducer;
