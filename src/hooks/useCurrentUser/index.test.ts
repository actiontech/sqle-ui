import useCurrentUser from '.';
import { renderHooksWithRedux } from '../../testUtils/customRender';
import { SystemRole } from '../../data/common';
import { IUserBindProjectResV1 } from '../../api/common';
import { renderHook } from '@testing-library/react-hooks';
import { mockUseSelector } from '../../testUtils/mockRedux';

export const mockBindProjects: IUserBindProjectResV1[] = [
  {
    isManager: true,
    projectName: 'default',
  },
  {
    isManager: false,
    projectName: 'test',
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
      user: { role: SystemRole.admin, bindProjects: mockBindProjects },
    });
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.bindProjects).toEqual(mockBindProjects);
    expect(result.current.isProjectManager('test')).toBeFalsy();
    expect(result.current.isProjectManager('unknown')).toBeFalsy();
    expect(result.current.isProjectManager('default')).toBeTruthy();
  });
});
