import { renderHook } from '@testing-library/react-hooks';
import useRoutes from '.';
import { SystemRole } from '../../data/common';
import {
  globalRouterConfig,
  projectDetailRouterConfig,
} from '../../router/config';
import { mockUseSelector } from '../../testUtils/mockRedux';

describe('test hooks/useRoutes', () => {
  beforeEach(() => {
    mockUseSelector({
      user: { role: SystemRole.admin },
    });
  });
  test('should match snapshot', () => {
    const { result } = renderHook(() => useRoutes());

    expect(result.current.registerRouter(globalRouterConfig)).toMatchSnapshot();
    expect(
      result.current.registerRouter(projectDetailRouterConfig)
    ).toMatchSnapshot();
  });

  test('should return null when routing permission is admin and the current role is not admin', () => {
    mockUseSelector({
      user: { role: 'test' },
    });

    const { result } = renderHook(() => useRoutes());

    expect(
      result.current.registerRouter([
        {
          label: 'menu.platformManage',
          role: [SystemRole.admin],
          key: 'platformManage',
        },
      ])
    ).toEqual([null]);
  });
});
