import { renderWithThemeAndRouter } from '../../../../../testUtils/customRender';
import HeaderMenu from '../HeaderMenu';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { DEFAULT_PROJECT_NAME } from '../../../../../page/ProjectManage/ProjectDetail';
import { SystemRole } from '../../../../../data/common';
import { useSelector } from 'react-redux';
import useNavigate from '../../../../../hooks/useNavigate';
import { mockBindProjects } from '../../../../../hooks/useCurrentUser/index.test.data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('../../../../../hooks/useNavigate', () => jest.fn());

describe('test Nav/Header/HeaderMenu', () => {
  let errorSpy!: jest.SpyInstance;
  const navigateSpy = jest.fn();

  beforeAll(() => {
    const error = global.console.error;
    errorSpy = jest.spyOn(global.console, 'error');
    errorSpy.mockImplementation((message: string) => {
      if (
        message.includes(
          ' React does not recognize the `eventKey` prop on a DOM element'
        )
      ) {
        return;
      }
      error(message);
    });
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { role: SystemRole.admin, bindProjects: mockBindProjects },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    window.localStorage.clear();
  });
  test('should match snapshot', () => {
    const { container } = renderWithThemeAndRouter(<HeaderMenu />);

    expect(container).toMatchSnapshot();
  });

  test('should jump to path when clicking the menu item', () => {
    renderWithThemeAndRouter(<HeaderMenu />, undefined, {
      initialEntries: ['/home'],
    });

    expect(screen.getByText('menu.dashboard')).toHaveClass(
      'header-menu-item-active'
    );
    fireEvent.click(screen.getByText('menu.dashboard'));
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(1, 'home');

    cleanup();

    renderWithThemeAndRouter(<HeaderMenu />, undefined, {
      initialEntries: ['/rule'],
    });
    expect(screen.getByText('menu.rule')).toHaveClass(
      'header-menu-item-active'
    );
    fireEvent.click(screen.getByText('menu.rule'));
    expect(navigateSpy).toBeCalledTimes(2);
    expect(navigateSpy).nthCalledWith(2, 'rule');

    cleanup();

    renderWithThemeAndRouter(<HeaderMenu />, undefined, {
      initialEntries: ['/sqlQuery'],
    });

    expect(screen.getByText('menu.sqlQuery')).toHaveClass(
      'header-menu-item-active'
    );
    fireEvent.click(screen.getByText('menu.sqlQuery'));
    expect(navigateSpy).toBeCalledTimes(3);
    expect(navigateSpy).nthCalledWith(3, 'sqlQuery');

    cleanup();

    renderWithThemeAndRouter(<HeaderMenu />, undefined, {
      initialEntries: ['/project'],
    });

    expect(screen.getAllByText('menu.projectManage')[0]).toHaveClass(
      'header-menu-item-active'
    );
    fireEvent.click(screen.getAllByText('menu.projectManage')[0]);
    expect(navigateSpy).toBeCalledTimes(3);

    fireEvent.click(screen.getAllByText('menu.projectManage')[1]);
    expect(navigateSpy).toBeCalledTimes(4);
    expect(navigateSpy).nthCalledWith(
      4,
      `project/${DEFAULT_PROJECT_NAME}/overview`
    );
  });
});
