import Header from '.';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { SupportLanguage } from '../../../locale';
import { SupportTheme } from '../../../theme';
import { ModalName } from '../../../data/ModalName';
import { mockBindProjects } from '../../../hooks/useCurrentUser/index.test';
import { SQLE_DEFAULT_WEB_TITLE } from '../../../data/common';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('Header', () => {
  const scopeDispatch = jest.fn();
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          username: 'admin',
          theme: SupportTheme.LIGHT,
          bindProjects: mockBindProjects,
        },
        locale: { language: SupportLanguage.zhCN },
        nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
        system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
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
