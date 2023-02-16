import useCurrentUser from '.';
import { renderHooksWithRedux } from '../../testUtils/customRender';
import { SystemRole } from '../../data/common';
import {
  IManagementPermissionResV1,
  IUserBindProjectResV1,
} from '../../api/common';
import { renderHook } from '@testing-library/react-hooks';
import { mockUseDispatch, mockUseSelector } from '../../testUtils/mockRedux';

export const mockBindProjects: IUserBindProjectResV1[] = [
  {
    is_manager: true,
    project_name: 'default',
  },
  {
    is_manager: false,
    project_name: 'test',
  },
];

export const mockManagementPermissions: IManagementPermissionResV1[] = [
  {
    code: 1,
    desc: '创建项目',
  },
];

describe('hooks/useCurrentUser', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should return true while role is admin', () => {
    const { result } = renderHooksWithRedux(() => useCurrentUser(), {
      user: { role: SystemRole.admin },
    });
    expect(result.current.isAdmin).toBeTruthy();
  });

  test('should judge whether project manager based on bound project data and the current project name', () => {
    mockUseSelector({
      user: {
        username: 'test',
        role: SystemRole.admin,
        bindProjects: mockBindProjects,
        managementPermissions: mockManagementPermissions,
      },
    });
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.bindProjects).toEqual(mockBindProjects);
    expect(result.current.username).toBe('test');
    expect(result.current.managementPermissions).toEqual(
      mockManagementPermissions
    );
    expect(result.current.isProjectManager('test')).toBeFalsy();
    expect(result.current.isProjectManager('unknown')).toBeFalsy();
    expect(result.current.isProjectManager('default')).toBeTruthy();
  });
});
