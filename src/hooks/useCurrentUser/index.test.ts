import useCurrentUser from '.';
import { renderHooksWithRedux } from '../../testUtils/customRender';
import { SystemRole } from '../../data/common';
import {
  IManagementPermissionResV1,
  IUserBindProjectResV1,
} from '../../api/common';
import { renderHook } from '@testing-library/react-hooks';
import { mockUseSelector } from '../../testUtils/mockRedux';

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
  test('should return true while role is admin', () => {
    const { result } = renderHooksWithRedux(() => useCurrentUser(), {
      user: { role: SystemRole.admin },
    });
    expect(result.current.isAdmin).toBeTruthy();
  });

  test('should judge whether project manager based on bound project data and the current project name', () => {
    mockUseSelector({
      user: {
        role: SystemRole.admin,
        bindProjects: mockBindProjects,
        managementPermissions: mockManagementPermissions,
      },
    });
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.bindProjects).toEqual(mockBindProjects);
    expect(result.current.managementPermissions).toEqual(
      mockManagementPermissions
    );
    expect(result.current.isProjectManager('test')).toBeFalsy();
    expect(result.current.isProjectManager('unknown')).toBeFalsy();
    expect(result.current.isProjectManager('default')).toBeTruthy();
  });
});
