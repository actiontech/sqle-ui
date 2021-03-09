import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const locale = createSlice({
  name: 'locale',
  initialState: {
    language: 'Zh-cn',
  },
  reducers: {
    updateLanguage: (
      state,
      { payload: { language } }: PayloadAction<{ language: string }>
    ) => {
      state.language = language;
    },
  },
});

export const { updateLanguage } = locale.actions;

export default locale.reducer;
