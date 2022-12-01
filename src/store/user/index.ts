import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IManagementPermissionResV1,
  IUserBindProjectResV1,
} from '../../api/common';
import { SystemRole } from '../../data/common';
import StorageKey from '../../data/StorageKey';
import { SupportTheme } from '../../theme';
import LocalStorageWrapper from '../../utils/LocalStorageWrapper';

type UserReduxState = {
  username: string;
  role: SystemRole | '';
  token: string;
  theme: string;
  bindProjects: IUserBindProjectResV1[];
  managementPermissions: IManagementPermissionResV1[];
};

const initialState: UserReduxState = {
  username: '',
  role: '',
  token: LocalStorageWrapper.getOrDefault(StorageKey.Token, ''),
  theme: LocalStorageWrapper.getOrDefault(StorageKey.Theme, SupportTheme.LIGHT),
  bindProjects: [],
  managementPermissions: [],
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (
      state,
      {
        payload: { username, role },
      }: PayloadAction<{ username: string; role: SystemRole | '' }>
    ) => {
      state.username = username;
      state.role = role;
    },
    updateTheme: (
      state,
      { payload: { theme } }: PayloadAction<{ theme: SupportTheme }>
    ) => {
      state.theme = theme;
      LocalStorageWrapper.set(StorageKey.Theme, theme);
    },
    updateToken: (
      state,
      { payload: { token } }: PayloadAction<{ token: string }>
    ) => {
      state.token = token;
      LocalStorageWrapper.set(StorageKey.Token, token);
    },
    updateBindProjects: (
      state,
      {
        payload: { bindProjects },
      }: PayloadAction<{ bindProjects: IUserBindProjectResV1[] }>
    ) => {
      state.bindProjects = bindProjects;
    },
    updateManagementPermissions: (
      state,
      {
        payload: { managementPermissions },
      }: PayloadAction<{ managementPermissions: IManagementPermissionResV1[] }>
    ) => {
      state.managementPermissions = managementPermissions;
    },
  },
});

export const {
  updateUser,
  updateTheme,
  updateToken,
  updateBindProjects,
  updateManagementPermissions,
} = user.actions;

export default user.reducer;
