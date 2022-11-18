import { renderWithRouter } from '../../../../../testUtils/customRender';
import Logo from '../Logo';

describe('test Nav/Header/Logo', () => {
  test('should match snapshot', () => {
    const { container } = renderWithRouter(<Logo />);
    expect(container).toMatchSnapshot();
  });
});
