import { SQLE_DEFAULT_WEB_TITLE } from '../../../../../data/common';
import { renderWithRouterAndRedux } from '../../../../../testUtils/customRender';
import Logo from '../Logo';

describe('test Nav/Header/Logo', () => {
  test('should match snapshot', () => {
    const { container } = renderWithRouterAndRedux(<Logo />, undefined, {
      system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
    });
    expect(container).toMatchSnapshot();
  });
});
