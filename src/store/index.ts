import { configureStore } from '@reduxjs/toolkit';
import locale from './locale';
import user from './user';

const store = configureStore({
  reducer: {
    locale,
    user,
  },
});

export type IReduxState = ReturnType<typeof store.getState>;

export default store;
