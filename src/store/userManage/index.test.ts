import reducers, { updateSelectRole, updateSelectUser } from '.';
import { IReduxState } from '..';

describe('store/user', () => {
  test('should create action', () => {
    expect(
      updateSelectRole({
        role: {
          role_name: 'role_name1',
          role_desc: 'desc',
          user_name_list: ['user1'],
          instance_name_list: ['instance1'],
        },
      })
    ).toEqual({
      payload: {
        role: {
          role_name: 'role_name1',
          role_desc: 'desc',
          user_name_list: ['user1'],
          instance_name_list: ['instance1'],
        },
      },
      type: 'user/updateSelectRole',
    });
    expect(
      updateSelectUser({
        user: {
          email: '22222@163.com',
          role_name_list: ['role1'],
          user_name: 'user1',
        },
      })
    ).toEqual({
      payload: {
        user: {
          email: '22222@163.com',
          role_name_list: ['role1'],
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
  };

  test('should update selectUser when dispatch updateUser action', () => {
    const newState = reducers(
      state,
      updateSelectUser({
        user: {
          email: '22222@163.com',
          role_name_list: ['role1'],
          user_name: 'user1',
        },
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectRole: null,
      selectUser: {
        email: '22222@163.com',
        role_name_list: ['role1'],
        user_name: 'user1',
      },
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
          user_name_list: ['user1'],
          instance_name_list: ['instance1'],
        },
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectRole: {
        role_name: 'role_name1',
        role_desc: 'desc',
        user_name_list: ['user1'],
        instance_name_list: ['instance1'],
      },
      selectUser: null,
      modalStatus: {},
    });
  });
});
