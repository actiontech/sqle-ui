import Nav from '.';
import { SupportLanguage } from '../../locale';
import { renderWithRouter } from '../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../testUtils/mockRedux';
import { mockUseStyle } from '../../testUtils/mockStyle';

describe('Nav', () => {
  let useSelectorSpy: jest.SpyInstance;

  beforeEach(() => {
    useSelectorSpy = mockUseSelector({
      user: { role: '', username: 'test' },
      locale: { language: SupportLanguage.zhCN },
    });
    mockUseStyle();
    mockUseDispatch();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render page by props of username', async () => {
    const { container } = renderWithRouter(<Nav>show</Nav>);
    expect(container).toMatchSnapshot();

    useSelectorSpy.mockClear();
    useSelectorSpy = mockUseSelector({
      user: { role: '', username: '' },
      locale: { language: SupportLanguage.zhCN },
    });
    const { container: notShowContainer } = renderWithRouter(
      <Nav>notshow</Nav>
    );

    expect(notShowContainer).toMatchSnapshot();
  });
});
