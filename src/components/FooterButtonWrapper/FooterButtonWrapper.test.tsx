import { render } from '@testing-library/react';
import FooterButtonWrapper from '.';

const children1 = <button>button1</button>;
const children2 = <button>button2</button>;

describe('test FooterButtonWrapper', () => {
  it('should match snapshot', () => {
    const { container, rerender } = render(
      <FooterButtonWrapper>
        {children1}
        {children2}
      </FooterButtonWrapper>
    );

    expect(container).toMatchSnapshot();

    rerender(
      <FooterButtonWrapper insideProject={false}>
        {children1}
        {children2}
      </FooterButtonWrapper>
    );
    expect(container).toMatchSnapshot();
  });
});
