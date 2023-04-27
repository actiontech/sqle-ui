import { renderHook } from '@testing-library/react-hooks';
import useBack from '.';
import useNavigate from '../useNavigate';

jest.mock('../useNavigate', () => jest.fn());

describe('useBack', () => {
  test('should jump to last path in history when call goBack', () => {
    const navigateSpy = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    const { result } = renderHook(() => useBack());
    result.current.goBack();
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith(-1);
  });
});
