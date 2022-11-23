import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../../testUtils/mockRedux';
import { SupportTheme } from '../../../../../theme';
import MoreAction from '../MoreAction';
import { createMemoryHistory } from 'history';
import { renderWithServerRouter } from '../../../../../testUtils/customRender';

describe('test Nav/Header/MoreAction', () => {
  let scopeDispatch: jest.Mock;
  beforeEach(() => {
    mockUseSelector({
      user: { username: 'admin', theme: SupportTheme.LIGHT, role: 'admin' },
    });
    scopeDispatch = mockUseDispatch().scopeDispatch;
  });

  afterEach(() => {
    scopeDispatch.mockClear();
    jest.clearAllMocks();
  });

  test('should match snapshot', async () => {
    const { baseElement, rerender } = render(<MoreAction />);
    fireEvent.mouseEnter(screen.getByTestId('more-action-icon'));

    await waitFor(() => screen.getByText('system.log.version'));
    expect(baseElement).toMatchSnapshot();

    mockUseSelector({
      user: { username: 'test', role: 'role' },
    });
    rerender(<MoreAction />);

    fireEvent.mouseEnter(screen.getByTestId('more-action-icon'));

    await waitFor(() => screen.getByText('system.log.version'));
    expect(baseElement).toMatchSnapshot();
  });

  test('should opened version info modal when clicking "system.log.version"', async () => {
    render(<MoreAction />);
    fireEvent.mouseEnter(screen.getByTestId('more-action-icon'));

    await waitFor(() => screen.getByText('system.log.version'));
    expect(scopeDispatch).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('system.log.version'));
    expect(scopeDispatch).toBeCalledTimes(1);
    expect(scopeDispatch).toBeCalledWith({
      payload: { modalName: ModalName.SHOW_VERSION, status: true },
      type: 'nav/updateModalStatus',
    });
  });

  test('should jump to path when clicking menu item', async () => {
    const history = createMemoryHistory();
    history.push('/test');
    renderWithServerRouter(<MoreAction />, undefined, { history });
    expect(history.location.pathname).toBe('/test');

    fireEvent.mouseEnter(screen.getByTestId('more-action-icon'));

    await waitFor(() => screen.getByText('system.log.version'));

    fireEvent.click(screen.getByText('menu.reportStatistics'));
    expect(history.location.pathname).toBe('/reportStatistics');

    fireEvent.click(screen.getByText('menu.user'));
    expect(history.location.pathname).toBe('/user');

    fireEvent.click(screen.getByText('menu.role'));
    expect(history.location.pathname).toBe('/user/role');

    fireEvent.click(screen.getByText('menu.userGroup'));
    expect(history.location.pathname).toBe('/user/group');

    fireEvent.click(screen.getByText('menu.globalRuleTemplate'));
    expect(history.location.pathname).toBe('/rule/template');

    fireEvent.click(screen.getByText('menu.systemSetting'));
    expect(history.location.pathname).toBe('/system');
  });
});
