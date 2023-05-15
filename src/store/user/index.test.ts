import reducers, {
  updateBindProjects,
  updateManagementPermissions,
  updateTheme,
  updateToken,
  updateUser,
} from '.';
import { IReduxState } from '..';
import { SystemRole } from '../../data/common';
import StorageKey from '../../data/StorageKey';
import {
  mockBindProjects,
  mockManagementPermissions,
} from '../../hooks/useCurrentUser/index.test.data';
import { SupportTheme } from '../../theme';
import LocalStorageWrapper from '../../utils/LocalStorageWrapper';

describe('store/user', () => {
  test('should create action', () => {
    expect(updateUser({ username: 'user1', role: SystemRole.admin })).toEqual({
      payload: {
        role: 'admin',
        username: 'user1',
      },
      type: 'user/updateUser',
    });
    expect(updateTheme({ theme: SupportTheme.LIGHT })).toEqual({
      payload: {
        theme: SupportTheme.LIGHT,
      },
      type: 'user/updateTheme',
    });
    expect(updateToken({ token: 'token' })).toEqual({
      payload: {
        token: 'token',
      },
      type: 'user/updateToken',
    });
    expect(updateBindProjects({ bindProjects: mockBindProjects })).toEqual({
      payload: {
        bindProjects: mockBindProjects,
      },
      type: 'user/updateBindProjects',
    });
    expect(
      updateManagementPermissions({
        managementPermissions: mockManagementPermissions,
      })
    ).toEqual({
      payload: {
        managementPermissions: mockManagementPermissions,
      },
      type: 'user/updateManagementPermissions',
    });
  });

  const state: IReduxState['user'] = {
    username: '',
    role: '',
    token: '',
    theme: SupportTheme.LIGHT,
    bindProjects: [],
    managementPermissions: [],
  };

  test('should update username and role when dispatch updateUser action', () => {
    const newState = reducers(
      state,
      updateUser({ username: 'user1', role: SystemRole.admin })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: 'user1',
      role: SystemRole.admin,
      token: '',
      theme: SupportTheme.LIGHT,
      bindProjects: [],
      managementPermissions: [],
    });
  });

  test('should update theme when dispatch updateTheme action', () => {
    const newState = reducers(state, updateTheme({ theme: SupportTheme.DARK }));
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: '',
      role: '',
      token: '',
      theme: SupportTheme.DARK,
      bindProjects: [],
      managementPermissions: [],
    });
  });

  test('should update token when dispatch updateTheme action', () => {
    const localStorageWrapperSpy = jest.spyOn(LocalStorageWrapper, 'set');
    const newState = reducers(state, updateToken({ token: 'token' }));
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: '',
      role: '',
      token: 'token',
      theme: SupportTheme.LIGHT,
      bindProjects: [],
      managementPermissions: [],
    });
    expect(localStorageWrapperSpy).toBeCalledWith(StorageKey.Token, 'token');
  });

  test('should update bind projects when dispatch updateBindProjects action', () => {
    const newState = reducers(
      state,
      updateBindProjects({ bindProjects: mockBindProjects })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      ...state,
      bindProjects: mockBindProjects,
    });
  });

  test('should update management permissions when dispatch updateManagementPermissions action', () => {
    const newState = reducers(
      state,
      updateManagementPermissions({
        managementPermissions: mockManagementPermissions,
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      ...state,
      managementPermissions: mockManagementPermissions,
    });
  });
});
