import { waitFor } from '@testing-library/react';
import Nav from '.';
import { SQLE_DEFAULT_WEB_TITLE } from '../../data/common';
import { ModalName } from '../../data/ModalName';
import { SupportLanguage } from '../../locale';
import { renderWithRouter } from '../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../testUtils/mockRedux';
import { mockUseAuditPlanTypes } from '../../testUtils/mockRequest';
import { mockUseStyle } from '../../testUtils/mockStyle';

describe('Nav', () => {
  let useSelectorSpy: jest.SpyInstance;

  beforeEach(() => {
    useSelectorSpy = mockUseSelector({
      user: { role: '', username: 'test' },
      locale: { language: SupportLanguage.zhCN },
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
      system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
    });
    mockUseStyle();
    mockUseDispatch();
    mockUseAuditPlanTypes();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should render page by props of username', async () => {
    const { container } = renderWithRouter(<Nav>show</Nav>);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(container).toMatchSnapshot();

    useSelectorSpy.mockClear();
    useSelectorSpy = mockUseSelector({
      user: { role: '', username: '' },
      locale: { language: SupportLanguage.zhCN },
      nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
      system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
    });
    const { container: notShowContainer } = renderWithRouter(
      <Nav>notshow</Nav>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(notShowContainer).toMatchSnapshot();
  });
});
