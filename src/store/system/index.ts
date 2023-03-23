import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SQLE_DEFAULT_WEB_TITLE } from '../../data/common';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';

type SystemReduxState = {
  modalStatus: ModalStatus;
  webTitle: string;
  webLogoUrl?: string;
};

const initialState: SystemReduxState = {
  modalStatus: {},
  webTitle: SQLE_DEFAULT_WEB_TITLE,
};

const system = createSlice({
  name: 'system',
  initialState,
  reducers: {
    updateWebTitleAndLog(
      state,
      {
        payload: { webTitle, webLogoUrl },
      }: PayloadAction<Omit<SystemReduxState, 'modalStatus'>>
    ) {
      state.webLogoUrl = webLogoUrl;
      state.webTitle = webTitle;
    },
    ...commonModalReducer(),
  },
});

export const {
  updateWebTitleAndLog,
  updateModalStatus: updateSystemModalStatus,
  initModalStatus: initSystemModalStatus,
} = system.actions;

export default system.reducer;
