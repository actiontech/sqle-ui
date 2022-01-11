import { createSlice } from '@reduxjs/toolkit';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';
type NavReduxState = {
  modalStatus: ModalStatus;
};

const initialState: NavReduxState = {
  modalStatus: {},
};
const nav = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    ...commonModalReducer(),
  },
});
export const {
  initModalStatus: initNavModalStatus,
  updateModalStatus: updateNavModalStatus,
} = nav.actions;

export default nav.reducer;
