import { waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import Nav from '.';
import { SQLE_DEFAULT_WEB_TITLE } from '../../data/common';
import { ModalName } from '../../data/ModalName';
import { SupportLanguage } from '../../locale';
import { renderWithRouter } from '../../testUtils/customRender';
import { mockUseAuditPlanTypes } from '../../testUtils/mockRequest';
import { mockUseStyle } from '../../testUtils/mockStyle';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('Nav', () => {
  beforeEach(() => {
    mockUseStyle();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { role: '', username: 'test' },
        locale: { language: SupportLanguage.zhCN },
        nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
        system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => jest.fn());

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

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: { role: '', username: '' },
        locale: { language: SupportLanguage.zhCN },
        nav: { modalStatus: { [ModalName.SHOW_VERSION]: false } },
        system: { webTitle: SQLE_DEFAULT_WEB_TITLE, webLogoUrl: 'test' },
      })
    );
    const { container: notShowContainer } = renderWithRouter(
      <Nav>notshow</Nav>
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(notShowContainer).toMatchSnapshot();
  });
});
