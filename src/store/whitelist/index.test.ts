import reducers, { updateSelectWhitelist } from '.';
import { IReduxState } from '..';

describe('store/user', () => {
  test('should create action', () => {
    expect(
      updateSelectWhitelist({
        whitelist: {
          audit_whitelist_id: 2,
          desc: 'desc',
          match_type: 'aaaaa',
          value: 'select a from b',
        },
      })
    ).toEqual({
      payload: {
        whitelist: {
          audit_whitelist_id: 2,
          desc: 'desc',
          match_type: 'aaaaa',
          value: 'select a from b',
        },
      },
      type: 'whitelist/updateSelectWhitelist',
    });
  });

  const state: IReduxState['whitelist'] = {
    selectWhitelist: null,
    modalStatus: {},
  };

  test('should update selectUser when dispatch updateUser action', () => {
    const newState = reducers(
      state,
      updateSelectWhitelist({
        whitelist: {
          audit_whitelist_id: 2,
          desc: 'desc',
          match_type: 'aaaaa',
          value: 'select a from b',
        },
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectWhitelist: {
        audit_whitelist_id: 2,
        desc: 'desc',
        match_type: 'aaaaa',
        value: 'select a from b',
      },
      modalStatus: {},
    });
  });
});
