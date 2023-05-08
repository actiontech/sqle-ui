import { SystemRole } from '../../../../../data/common';
import {
  renderWithTheme,
  renderWithThemeAndRouter,
} from '../../../../../testUtils/customRender';
import ProjectNavigation from '../ProjectNavigation';
import { useSelector } from 'react-redux';
import useNavigate from '../../../../../hooks/useNavigate';
import { mockBindProjects } from '../../../../../hooks/useCurrentUser/index.test.data';
import { fireEvent, screen } from '@testing-library/react';

const children = <div>test</div>;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../../../../hooks/useNavigate', () => jest.fn());

function sleep(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

describe('test ProjectNavigation', () => {
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
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { role: SystemRole.admin, bindProjects: mockBindProjects },
      });
    });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    window.localStorage.clear();
  });

  test('should match snapshot', async () => {
    const { baseElement } = renderWithTheme(
      <ProjectNavigation open={true}>{children}</ProjectNavigation>
    );

    expect(baseElement).toMatchSnapshot();
  });

  test('should update the recently used item when clicking on the project', async () => {
    const onVisibleChange = jest.fn();

    const { baseElement } = renderWithThemeAndRouter(
      <ProjectNavigation open={true} onOpenChange={onVisibleChange}>
        {children}
      </ProjectNavigation>
    );

    expect(
      screen.getAllByText(
        'projectManage.projectList.searchProject.notRecentlyOpenedProjects'
      )[0]
    ).toBeInTheDocument();

    fireEvent.change(screen.getAllByTestId('search-project-input')[0], {
      target: { value: 'd' },
    });
    await sleep(400);
    expect(
      screen.queryAllByText(
        'projectManage.projectList.searchProject.notRecentlyOpenedProjects'
      )[0]
    ).toBeUndefined();

    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('default')[0]);
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(1, 'project/default/overview');

    expect(onVisibleChange).toBeCalledTimes(1);
    expect(onVisibleChange).toBeCalledWith(false);
  });

  test('should be able to search for projects properly', async () => {
    const onVisibleChange = jest.fn();

    const { baseElement } = renderWithThemeAndRouter(
      <ProjectNavigation open={true} onOpenChange={onVisibleChange}>
        {children}
      </ProjectNavigation>
    );

    expect(screen.queryAllByTestId('search-loading')[0]).toBeUndefined();

    fireEvent.change(screen.getAllByTestId('search-project-input')[0], {
      target: { value: 'd' },
    });

    expect(screen.getAllByTestId('search-loading')[0]).toBeInTheDocument();

    await sleep(400);

    expect(screen.queryAllByTestId('search-loading')[0]).toBeUndefined();
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(screen.getAllByTestId('search-project-input')[0], {
      target: { value: '' },
    });

    await sleep(400);

    expect(
      screen.getAllByText(
        'projectManage.projectList.searchProject.notRecentlyOpenedProjects'
      )[0]
    ).toBeInTheDocument();

    fireEvent.change(screen.getAllByTestId('search-project-input')[0], {
      target: { value: 'd' },
    });

    expect(screen.getAllByTestId('search-loading')[0]).toBeInTheDocument();

    await sleep(400);

    fireEvent.click(screen.getAllByText('default')[0]);

    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(1, 'project/default/overview');

    expect(onVisibleChange).toBeCalledTimes(1);
    expect(onVisibleChange).toBeCalledWith(false);
  });

  test('should jump to project list page when click show all projects', () => {
    const onVisibleChange = jest.fn();

    renderWithThemeAndRouter(
      <ProjectNavigation open={true} onOpenChange={onVisibleChange}>
        {children}
      </ProjectNavigation>
    );

    fireEvent.click(screen.getByText('projectManage.projectList.allProject'));
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(1, 'project');

    expect(onVisibleChange).toBeCalledTimes(1);
    expect(onVisibleChange).toBeCalledWith(false);
  });
});
