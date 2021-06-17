import { createSlice } from '@reduxjs/toolkit';
import { commonModalReducer } from '.';
import { ModalStatus } from '../../types/common.type';

describe('store/common', () => {
  const testStore = createSlice({
    name: 'testStore',
    initialState: { modalStatus: {} },
    reducers: {
      ...commonModalReducer<{ modalStatus: ModalStatus }>(),
    },
  });

  test('should create action', () => {
    expect(
      testStore.actions.initModalStatus({ modalStatus: { test: true } })
    ).toEqual({
      payload: {
        modalStatus: {
          test: true,
        },
      },
      type: 'testStore/initModalStatus',
    });
    expect(
      testStore.actions.updateModalStatus({ modalName: 'test', status: false })
    ).toEqual({
      payload: {
        modalName: 'test',
        status: false,
      },
      type: 'testStore/updateModalStatus',
    });
  });

  test('should modify modal status', () => {
    const store = { modalStatus: {} };
    const newStore = testStore.reducer(
      store,
      testStore.actions.initModalStatus({ modalStatus: { test: false } })
    );
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual({ modalStatus: { test: false } });
  });

  test('should modify status of modal status by modal name', () => {
    const store = { modalStatus: { test: false } };
    const newStore = testStore.reducer(
      store,
      testStore.actions.updateModalStatus({ modalName: 'test', status: true })
    );
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual({ modalStatus: { test: true } });

    const newStore2 = testStore.reducer(
      store,
      testStore.actions.updateModalStatus({ modalName: 'test', status: true })
    );
    expect(newStore2).not.toBe(store);
    expect(newStore2).toEqual({ modalStatus: { test: true } });
  });
});
