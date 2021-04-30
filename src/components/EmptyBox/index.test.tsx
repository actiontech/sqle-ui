import { render } from '@testing-library/react';
import EmptyBox from '.';

describe('EmptyBox', () => {
  test('should render children by props of "if"', () => {
    const { container, rerender } = render(<EmptyBox>not visible</EmptyBox>);
    expect(container).toMatchSnapshot();
    rerender(<EmptyBox if={true}>visible</EmptyBox>);
    expect(container).toMatchSnapshot();
  });
  test('should render default node when "if" is falsy and "defaultNode" is truthy', () => {
    const { container, rerender } = render(
      <EmptyBox if={false} defaultNode="show default node">
        not visible
      </EmptyBox>
    );
    expect(container).toMatchSnapshot();
    rerender(
      <EmptyBox if={true} defaultNode="show default node">
        visible
      </EmptyBox>
    );
    expect(container).toMatchSnapshot();
  });
});
