import { render } from '@testing-library/react';
import AuditResultErrorMessage from '.';

describe('AuditResultErrorMessage', () => {
  const testCase1 =
    '[error]test1\n[notice]test2\n[warn]test3\n[error]test4\n[normal]   will trim   ';
  const testCase2 = 'unknown]test3';

  test('should render error list when "resultErrorMessage" exist', () => {
    const { container, rerender } = render(<AuditResultErrorMessage />);
    expect(container).toMatchSnapshot();
    rerender(<AuditResultErrorMessage resultErrorMessage={testCase1} />);
    expect(container).toMatchSnapshot();
  });
  test('should render normal level when not match level', () => {
    const { container } = render(
      <AuditResultErrorMessage resultErrorMessage={testCase2} />
    );
    expect(container).toMatchSnapshot();
  });
});
