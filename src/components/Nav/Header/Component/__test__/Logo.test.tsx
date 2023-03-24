import { SQLE_DEFAULT_WEB_TITLE } from '../../../../../data/common';
import { renderWithRouter } from '../../../../../testUtils/customRender';
import { mockUseSelector } from '../../../../../testUtils/mockRedux';
import Logo from '../Logo';

describe('test Nav/Header/Logo', () => {
  beforeEach(() => {
    mockUseSelector({
      system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
    });
  });
  test('should match snapshot', () => {
    const { container } = renderWithRouter(<Logo />);
    expect(container).toMatchSnapshot();
  });
});
