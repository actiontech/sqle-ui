import useCurrentUser from '.';
import { SystemRole } from '../../data/common';
import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import { mockBindProjects, mockManagementPermissions } from './index.test.data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

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
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { role: SystemRole.admin },
      });
    });
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.isAdmin).toBeTruthy();
  });

  test('should judge whether project manager based on bound project data and the current project name', () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          username: 'test',
          role: SystemRole.admin,
          bindProjects: mockBindProjects,
          managementPermissions: mockManagementPermissions,
        },
      });
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
