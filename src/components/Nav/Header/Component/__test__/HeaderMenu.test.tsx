import {
  renderWithThemeAndRouter,
  renderWithThemeAndServerRouter,
} from '../../../../../testUtils/customRender';
import HeaderMenu from '../HeaderMenu';
import { createMemoryHistory } from 'history';
import { fireEvent, screen } from '@testing-library/react';
import { DEFAULT_PROJECT_NAME } from '../../../../../page/ProjectManage/ProjectDetail';
import { mockUseSelector } from '../../../../../testUtils/mockRedux';
import { SystemRole } from '../../../../../data/common';
import { mockBindProjects } from '../../../../../hooks/useCurrentUser/index.test';

describe('test Nav/Header/HeaderMenu', () => {
  let errorSpy!: jest.SpyInstance;

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
    mockUseSelector({
      user: { role: SystemRole.admin, bindProjects: mockBindProjects },
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
    const history = createMemoryHistory();
    history.push('/test');
    const { baseElement } = renderWithThemeAndServerRouter(
      <HeaderMenu />,
      undefined,
      { history }
    );
    expect(history.location.pathname).toBe('/test');

    expect(screen.getByText('menu.dashboard')).not.toHaveClass(
      'header-menu-item-active'
    );
    fireEvent.click(screen.getByText('menu.dashboard'));
    expect(history.location.pathname).toBe('/');
    expect(screen.getByText('menu.dashboard')).toHaveClass(
      'header-menu-item-active'
    );

    expect(screen.getByText('menu.rule')).not.toHaveClass(
      'header-menu-item-active'
    );
    fireEvent.click(screen.getByText('menu.rule'));
    expect(history.location.pathname).toBe('/rule');
    expect(screen.getByText('menu.rule')).toHaveClass(
      'header-menu-item-active'
    );

    expect(screen.getByText('menu.sqlQuery')).not.toHaveClass(
      'header-menu-item-active'
    );
    fireEvent.click(screen.getByText('menu.sqlQuery'));
    expect(history.location.pathname).toBe('/sqlQuery');
    expect(screen.getByText('menu.sqlQuery')).toHaveClass(
      'header-menu-item-active'
    );

    expect(screen.getAllByText('menu.projectManage')[0]).not.toHaveClass(
      'header-menu-item-active'
    );
    fireEvent.click(screen.getAllByText('menu.projectManage')[0]);
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('menu.dashboard'));
    expect(screen.getAllByText('menu.projectManage')[1]).not.toHaveClass(
      'header-menu-item-active'
    );
    fireEvent.click(screen.getAllByText('menu.projectManage')[1]);
    expect(history.location.pathname).toBe(`/project/${DEFAULT_PROJECT_NAME}`);
    expect(screen.getAllByText('menu.projectManage')[1]).toHaveClass(
      'header-menu-item-active'
    );
  });
});
