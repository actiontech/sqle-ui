import { renderHook } from '@testing-library/react-hooks';

import { Router } from 'react-router';
import useBack from '.';

describe('useBack', () => {
  test('should jump to last path in history when call goBack', () => {
    // const history = createMemoryHistory();
    // history.push('/');
    // history.push('/test');
    // const { result } = renderHook(() => useBack(), {
    //   wrapper: Router,
    //   initialProps: { history },
    // });
    // expect(history.location.pathname).toBe('/test');
    // result.current.goBack();
    // expect(history.location.pathname).toBe('/');
  });
});
