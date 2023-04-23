import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import ProjectDetailLayout from '..';
import { SystemRole } from '../../../../../data/common';
import {
  renderWithRouter,
  renderWithMemoryRouter,
} from '../../../../../testUtils/customRender';

import {
  AuditPlanTypesData,
  mockUseAuditPlanTypes,
} from '../../../../../testUtils/mockRequest';

import {
  getBySelector,
  getHrefByText,
} from '../../../../../testUtils/customQuery';
import { mockUseStyle } from '../../../../../testUtils/mockStyle';
import { SupportTheme } from '../../../../../theme';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('test ProjectManage/ProjectDetailLayout', () => {
  const projectName = 'test';
  const children = <>children</>;
  let useAuditPlanTypesSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseStyle();

    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: SystemRole.admin,
          theme: SupportTheme.LIGHT,
        },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => jest.fn());

    useAuditPlanTypesSpy = mockUseAuditPlanTypes();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('should render menu by user role', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        user: {
          role: '',
          theme: SupportTheme.LIGHT,
        },
      })
    );
    const { container: normalMenu } = renderWithRouter(
      <ProjectDetailLayout projectName={projectName} archive={false}>
        {children}
      </ProjectDetailLayout>
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(useAuditPlanTypesSpy).toBeCalledTimes(1);
    expect(normalMenu).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(normalMenu).toMatchSnapshot();

    cleanup();

    const { container: adminMenu } = renderWithRouter(
      <ProjectDetailLayout projectName={projectName} archive={false}>
        {children}
      </ProjectDetailLayout>
    );
    expect(useAuditPlanTypesSpy).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(adminMenu).toMatchSnapshot();
  });

  test('should render active menu by router pathname', async () => {
    renderWithMemoryRouter(
      <ProjectDetailLayout projectName={projectName} archive={false}>
        {children}
      </ProjectDetailLayout>,
      undefined,
      { initialEntries: [`/project/${projectName}/order`] }
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.order'
    );
    expect(getHrefByText('menu.order')).toBe(`/project/${projectName}/order`);

    cleanup();

    const { container } = renderWithMemoryRouter(
      <ProjectDetailLayout projectName={projectName} archive={false}>
        {children}
      </ProjectDetailLayout>,
      undefined,
      { initialEntries: [`/project/${projectName}/auditPlan?type=`] }
    );
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('menu.auditPlane'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      'menu.auditPlaneList'
    );
    expect(getHrefByText('menu.auditPlaneList')).toBe(
      `/project/${projectName}/auditPlan?type=`
    );

    cleanup();

    renderWithMemoryRouter(
      <ProjectDetailLayout projectName={projectName} archive={false}>
        {children}
      </ProjectDetailLayout>,
      undefined,
      {
        initialEntries: [
          `/project/${projectName}/auditPlan?type=${AuditPlanTypesData[0].type}`,
        ],
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('menu.auditPlane'));

    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      AuditPlanTypesData[0].desc
    );

    cleanup();

    renderWithMemoryRouter(
      <ProjectDetailLayout projectName={projectName} archive={false}>
        {children}
      </ProjectDetailLayout>,
      undefined,
      {
        initialEntries: [
          `/project/${projectName}/auditPlan?type=${AuditPlanTypesData[1].type}`,
        ],
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('menu.auditPlane'));

    expect(getBySelector('.ant-menu-item-selected')).toHaveTextContent(
      AuditPlanTypesData[1].desc
    );
  });
});
