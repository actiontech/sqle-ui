import { screen, waitFor } from '@testing-library/react';
import SiderMenu from '.';
import { SystemRole } from '../../../data/common';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import { createMemoryHistory } from 'history';

describe('SiderMenu', () => {
  let useSelectorSpy: jest.SpyInstance;

  beforeEach(() => {
    useSelectorSpy = mockUseSelector();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render menu by user role', () => {
    useSelectorSpy.mockReturnValue('');
    const { container: normalMenu } = renderWithRouter(<SiderMenu />);
    expect(normalMenu).toMatchSnapshot();

    useSelectorSpy.mockReturnValue(SystemRole.admin);
    const { container: adminMenu } = renderWithRouter(<SiderMenu />);
    expect(adminMenu).toMatchSnapshot();
  });

  test('should render active menu by router pathname', () => {
    useSelectorSpy.mockReturnValue(SystemRole.admin);
    const { container: dashboard } = renderWithRouter(<SiderMenu />);
    expect(dashboard).toMatchSnapshot();

    let history = createMemoryHistory();
    history.push('/rule');
    const { container: rule } = renderWithServerRouter(
      <SiderMenu />,
      undefined,
      { history }
    );
    expect(rule).toMatchSnapshot();

    history.push('/order');
    const { container: order } = renderWithServerRouter(
      <SiderMenu />,
      undefined,
      { history }
    );
    expect(order).toMatchSnapshot();

    history.push('/user');
    const { container: user } = renderWithServerRouter(
      <SiderMenu />,
      undefined,
      { history }
    );
    expect(user).toMatchSnapshot();

    history.push('/data');
    const { container: data } = renderWithServerRouter(
      <SiderMenu />,
      undefined,
      { history }
    );
    expect(data).toMatchSnapshot();

    history.push('/rule/template');
    const { container: ruleTemplate } = renderWithServerRouter(
      <SiderMenu />,
      undefined,
      { history }
    );
    expect(ruleTemplate).toMatchSnapshot();

    history.push('/whitelist');
    const { container: whitelist } = renderWithServerRouter(
      <SiderMenu />,
      undefined,
      { history }
    );
    expect(whitelist).toMatchSnapshot();

    history.push('/system');
    const { container: system } = renderWithServerRouter(
      <SiderMenu />,
      undefined,
      { history }
    );
    expect(system).toMatchSnapshot();
  });
});
