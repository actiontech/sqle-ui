import SiderMenu from '.';
import { SystemRole } from '../../../data/common';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import { createMemoryHistory } from 'history';
import { waitFor } from '@testing-library/react';
import { getBySelector } from '../../../testUtils/customQuery';

describe('SiderMenu', () => {
  let useSelectorSpy: jest.SpyInstance;

  beforeEach(() => {
    useSelectorSpy = mockUseSelector();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should render menu by user role', async () => {
    useSelectorSpy.mockReturnValue('');
    const { container: normalMenu } = renderWithRouter(<SiderMenu />);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(normalMenu).toMatchSnapshot();

    useSelectorSpy.mockReturnValue(SystemRole.admin);
    const { container: adminMenu } = renderWithRouter(<SiderMenu />);
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(adminMenu).toMatchSnapshot();
  });

  test('should render active menu by router pathname', async () => {
    useSelectorSpy.mockReturnValue(SystemRole.admin);
    let history = createMemoryHistory();
    renderWithServerRouter(<SiderMenu />, undefined, { history });
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.dashboard'
    );
    history.push('/order');
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.order'
    );
    history.push('/user');
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.user'
    );
    history.push('/data');
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.dataSource'
    );
    history.push('/rule/template');
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.ruleTemplate'
    );
    history.push('/whitelist');
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.whitelist'
    );
    history.push('/system');
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.system'
    );
    history.push('/progress');
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.progress'
    );
  });
});
