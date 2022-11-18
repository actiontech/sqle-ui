import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../../../testUtils/customRender';
import HeaderMenu from '../HeaderMenu';
import { createMemoryHistory } from 'history';
import { fireEvent, screen } from '@testing-library/react';
import { DEFAULT_PROJECT_NAME } from '../../../../../page/ProjectManage/ProjectDetail';

describe('test Nav/Header/HeaderMenu', () => {
  test('should match snapshot', () => {
    const { container } = renderWithRouter(<HeaderMenu />);

    expect(container).toMatchSnapshot();
  });

  test('should jump to path when clicking the menu item', () => {
    const history = createMemoryHistory();
    history.push('/test');
    renderWithServerRouter(<HeaderMenu />, undefined, { history });
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
    expect(history.location.pathname).toBe('/project');
    expect(screen.getAllByText('menu.projectManage')[0]).toHaveClass(
      'header-menu-item-active'
    );

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
