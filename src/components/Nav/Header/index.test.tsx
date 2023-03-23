import Header from '.';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { SupportLanguage } from '../../../locale';
import { SupportTheme } from '../../../theme';
import { ModalName } from '../../../data/ModalName';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test';
import { SQLE_DEFAULT_WEB_TITLE } from '../../../data/common';

describe('Header', () => {
  let scopeDispatch: jest.Mock;
  beforeEach(() => {
    mockUseSelector({
      user: {
        username: 'admin',
        theme: SupportTheme.LIGHT,
        bindProjects: mockBindProjects,
      },
      locale: { language: SupportLanguage.zhCN },
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
      system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
    });
    scopeDispatch = mockUseDispatch().scopeDispatch;
  });

  afterEach(() => {
    scopeDispatch.mockClear();
    jest.clearAllMocks();
  });

  test('should match snapshot', () => {
    const { baseElement } = renderWithThemeAndRouter(<Header />);

    expect(baseElement).toMatchSnapshot();
  });
});
