import { createSlice } from '@reduxjs/toolkit';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';

type SystemReduxState = {
  modalStatus: ModalStatus;
};

const initialState: SystemReduxState = {
  modalStatus: {},
};

const system = createSlice({
  name: 'system',
  initialState,
  reducers: {
    ...commonModalReducer(),
  },
});

export const {
  updateModalStatus: updateSystemModalStatus,
  initModalStatus: initSystemModalStatus,
} = system.actions;

export default system.reducer;
