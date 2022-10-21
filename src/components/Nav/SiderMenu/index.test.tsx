import SiderMenu from '.';
import { SystemRole } from '../../../data/common';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../testUtils/customRender';
import { mockUseSelector } from '../../../testUtils/mockRedux';
import { createMemoryHistory } from 'history';
import { cleanup, waitFor } from '@testing-library/react';
import { getBySelector } from '../../../testUtils/customQuery';
import { mockUseAuditPlanTypes } from '../../../testUtils/mockRequest';

describe('SiderMenu', () => {
  let useSelectorSpy: jest.SpyInstance;
  let useAuditPlanTypesSpy: jest.SpyInstance;

  beforeEach(() => {
    useSelectorSpy = mockUseSelector();
    useAuditPlanTypesSpy = mockUseAuditPlanTypes();
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
    expect(useAuditPlanTypesSpy).toBeCalledTimes(1);
    expect(normalMenu).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(normalMenu).toMatchSnapshot();

    cleanup();
    useSelectorSpy.mockReturnValue(SystemRole.admin);
    const { container: adminMenu } = renderWithRouter(<SiderMenu />);
    expect(useAuditPlanTypesSpy).toBeCalledTimes(2);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(adminMenu).toMatchSnapshot();
  }); 

  test('should render active menu by router pathname', async () => {
    useSelectorSpy.mockReturnValue(SystemRole.admin);
    let history = createMemoryHistory();
    renderWithServerRouter(<SiderMenu />, undefined, { history });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
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
    history.push('/auditPlan');
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.auditPlan'
    );
    history.push('/auditPlan?type=ali_rds_mysql_audit_log');
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      '阿里RDS MySQL审计日志'
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
