import Header from '.';
import { renderWithRouter } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import { SupportLanguage } from '../../../locale';
import { SupportTheme } from '../../../theme';
import { ModalName } from '../../../data/ModalName';

describe('Header', () => {
  let scopeDispatch: jest.Mock;
  beforeEach(() => {
    mockUseSelector({
      user: { username: 'admin', theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
    });
    scopeDispatch = mockUseDispatch().scopeDispatch;
  });

  afterEach(() => {
    scopeDispatch.mockClear();
    jest.clearAllMocks();
  });

  test('should match snapshot', () => {
    const { baseElement } = renderWithRouter(<Header />);

    expect(baseElement).toMatchSnapshot();
  });
});
