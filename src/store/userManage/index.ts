import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRoleResV1, IUserResV1 } from '../../api/common';
import { ModalStatus } from '../../types/common.type';
import { commonModalReducer } from '../common';

type UserManageReduxState = {
  modalStatus: ModalStatus;
  selectRole: IRoleResV1 | null;
  selectUser: IUserResV1 | null;
};

const initialState: UserManageReduxState = {
  selectRole: null,
  selectUser: null,
  modalStatus: {},
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSelectUser(
      state,
      { payload: { user } }: PayloadAction<{ user: IUserResV1 | null }>
    ) {
      state.selectUser = user;
    },
    updateSelectRole(
      state,
      { payload: { role } }: PayloadAction<{ role: IRoleResV1 | null }>
    ) {
      state.selectRole = role;
    },
    ...commonModalReducer(),
  },
});

export const {
  updateSelectRole,
  updateSelectUser,
  initModalStatus: initUserManageModalStatus,
  updateModalStatus: updateUserManageModalStatus,
} = user.actions;

export default user.reducer;
