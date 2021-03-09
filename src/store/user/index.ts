import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const user = createSlice({
  name: 'user',
  initialState: {
    username: ''
  },
  reducers: {
    updateUsername: (
      state,
      { payload: { username } }: PayloadAction<{ username: string }>
    ) => {
      state.username = username
    },
  },
});

export const { updateUsername } = user.actions;

export default user.reducer;


