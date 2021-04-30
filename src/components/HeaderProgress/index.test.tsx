import { render } from '@testing-library/react';
import HeaderProgress from '.';
import MockNprogress from 'nprogress';

jest.mock('nprogress', () => ({
  configure: jest.fn(),
  start: jest.fn(),
  done: jest.fn(),
}));

describe('HeaderProgress', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should render children by props of "if"', () => {
    const { unmount } = render(<HeaderProgress />);
    expect(MockNprogress.start).toBeCalledTimes(1);
    unmount();
    expect(MockNprogress.done).toBeCalledTimes(1);
  });
});
