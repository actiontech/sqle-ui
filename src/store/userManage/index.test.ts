import reducers, { updateSelectRole, updateSelectUser } from '.';
import { IReduxState } from '..';

describe('store/user', () => {
  test('should create action', () => {
    expect(
      updateSelectRole({
        role: {
          role_name: 'role_name1',
          role_desc: 'desc',
        },
      })
    ).toEqual({
      payload: {
        role: {
          role_name: 'role_name1',
          role_desc: 'desc',
        },
      },
      type: 'user/updateSelectRole',
    });
    expect(
      updateSelectUser({
        user: {
          email: '22222@163.com',
          user_name: 'user1',
        },
      })
    ).toEqual({
      payload: {
        user: {
          email: '22222@163.com',
          user_name: 'user1',
        },
      },
      type: 'user/updateSelectUser',
    });
  });

  const state: IReduxState['userManage'] = {
    selectRole: null,
    selectUser: null,
    modalStatus: {},
    selectUserGroup: null,
  };

  test('should update selectUser when dispatch updateUser action', () => {
    const newState = reducers(
      state,
      updateSelectUser({
        user: {
          email: '22222@163.com',
          user_name: 'user1',
        },
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectRole: null,
      selectUser: {
        email: '22222@163.com',
        user_name: 'user1',
      },
      selectUserGroup: null,
      modalStatus: {},
    });
  });

  test('should update selectRole when dispatch updateRole action', () => {
    const newState = reducers(
      state,
      updateSelectRole({
        role: {
          role_name: 'role_name1',
          role_desc: 'desc',
        },
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectRole: {
        role_name: 'role_name1',
        role_desc: 'desc',
      },
      selectUserGroup: null,
      selectUser: null,
      modalStatus: {},
    });
  });
});
