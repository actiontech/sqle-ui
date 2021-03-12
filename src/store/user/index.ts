import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import StorageKey from '../../data/StorageKey';
import { SupportTheme } from '../../theme';
import LocalStorageWrapper from '../../utils/LocalStorageWrapper';

type UserReduxState = {
  username: string;
  role: string;
  token: string;
  theme: string;
};

const initialState: UserReduxState = {
  username: LocalStorageWrapper.getOrDefault(StorageKey.Username, ''),
  role: '',
  token: LocalStorageWrapper.getOrDefault(StorageKey.Token, ''),
  theme: LocalStorageWrapper.getOrDefault(StorageKey.Theme, SupportTheme.LIGHT),
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (
      state,
      {
        payload: { username, role, token },
      }: PayloadAction<{ username: string; role: string; token: string }>
    ) => {
      state.username = username;
      state.role = role;
      state.token = token;
      LocalStorageWrapper.set(StorageKey.Username, state.username);
      LocalStorageWrapper.set(StorageKey.Token, state.token);
    },
    updateTheme: (
      state,
      { payload: { theme } }: PayloadAction<{ theme: SupportTheme }>
    ) => {
      state.theme = theme;
      LocalStorageWrapper.set(StorageKey.Theme, theme);
    },
  },
});

export const { updateUser, updateTheme } = user.actions;

export default user.reducer;
