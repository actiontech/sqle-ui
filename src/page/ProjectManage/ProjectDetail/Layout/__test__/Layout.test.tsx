import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import ProjectDetailLayout from '..';
import { SystemRole } from '../../../../../data/common';
import {
  renderWithRouter,
  renderWithServerRouter,
} from '../../../../../testUtils/customRender';
import { mockUseSelector } from '../../../../../testUtils/mockRedux';
import {
  AuditPlanTypesData,
  mockUseAuditPlanTypes,
} from '../../../../../testUtils/mockRequest';
import { createMemoryHistory } from 'history';
import { getBySelector } from '../../../../../testUtils/customQuery';

describe('test ProjectManage/ProjectDetailLayout', () => {
  const projectName = 'test';
  const children = <>children</>;
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
    const { container: normalMenu } = renderWithRouter(
      <ProjectDetailLayout projectName={projectName}>
        {children}
      </ProjectDetailLayout>
    );
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
    const { container: adminMenu } = renderWithRouter(
      <ProjectDetailLayout projectName={projectName}>
        {children}
      </ProjectDetailLayout>
    );
    expect(useAuditPlanTypesSpy).toBeCalledTimes(2);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(adminMenu).toMatchSnapshot();
  });

  test('should render active menu by router pathname', async () => {
    useSelectorSpy.mockReturnValue(SystemRole.admin);
    let history = createMemoryHistory();

    renderWithServerRouter(
      <ProjectDetailLayout projectName={projectName}>
        {children}
      </ProjectDetailLayout>,
      undefined,
      { history }
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    history.push(`/project/${projectName}/order`);
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.order'
    );

    fireEvent.click(screen.getByText('menu.auditPlane'));

    history.push(`/project/${projectName}/auditPlan`);
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.auditPlaneList'
    );
    history.push(
      `/project/${projectName}/auditPlan?type=${AuditPlanTypesData[0].type}`
    );
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      AuditPlanTypesData[0].desc
    );
    history.push(
      `/project/${projectName}/auditPlan?type=${AuditPlanTypesData[1].type}`
    );
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      AuditPlanTypesData[1].desc
    );
  });
});
