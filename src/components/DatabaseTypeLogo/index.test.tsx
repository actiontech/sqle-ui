import { render } from '@testing-library/react';
import DatabaseTypeLogo from '.';

describe('test DatabaseTypeLogo', () => {
  test('should match snapshot', () => {
    const { container, rerender } = render(<DatabaseTypeLogo dbType="mysql" />);

    expect(container).toMatchSnapshot();

    rerender(
      <DatabaseTypeLogo dbType="db2" logoUrl="/static/medit/logo.png" />
    );
    expect(container).toMatchSnapshot();
  });
});
