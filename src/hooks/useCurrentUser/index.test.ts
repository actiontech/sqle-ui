import useRole from '.';
import { renderHooksWithRedux } from '../../testUtils/customRender';
import { SystemRole } from '../../data/common';
describe('hooks/useCurrentUser', () => {
  test('should return true while role is admin', () => {
    const { result } = renderHooksWithRedux(() => useRole(), {
      user: { role: SystemRole.admin },
    });
    expect(result.current.isAdmin).toBeTruthy();
  });
});
