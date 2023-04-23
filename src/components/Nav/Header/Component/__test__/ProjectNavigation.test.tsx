import { SystemRole } from '../../../../../data/common';
import { mockBindProjects } from '../../../../../hooks/useCurrentUser/index.test';
import { renderWithTheme } from '../../../../../testUtils/customRender';
import ProjectNavigation from '../ProjectNavigation';
import { useSelector } from 'react-redux';
import useNavigate from '../../../../../hooks/useNavigate';

const children = 'test';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../../../../hooks/useNavigate', () => jest.fn());

describe.skip('test ProjectNavigation', () => {
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

  // test('should update the recently used item when clicking on the project', async () => {
  //   const onVisibleChange = jest.fn();

  //   const { baseElement } = renderWithThemeAndRouter(
  //     <ProjectNavigation visible={true} onVisibleChange={onVisibleChange}>
  //       {children}
  //     </ProjectNavigation>
  //   );

  //   expect(
  //     screen.queryAllByText(
  //       'projectManage.projectList.searchProject.notRecentlyOpenedProjects'
  //     )[0]
  //   ).toBeInTheDocument();

  //   fireEvent.change(screen.getAllByTestId('search-project-input')[0], {
  //     target: { value: 'd' },
  //   });
  //   await sleep(400);
  //   fireEvent.click(screen.getAllByText('default')[0]);
  //   expect(
  //     screen.queryAllByText(
  //       'projectManage.projectList.searchProject.notRecentlyOpenedProjects'
  //     )[0]
  //   ).toBeUndefined();

  //   expect(baseElement).toMatchSnapshot();

  //   fireEvent.click(screen.getAllByText('default')[0]);

  //   expect(history.location.pathname).toBe('/project/default');

  //   expect(onVisibleChange).toBeCalledTimes(2);
  //   expect(onVisibleChange).toBeCalledWith(false);
  // });

  // test('should be able to search for projects properly', async () => {
  //   const history = createMemoryHistory();
  //   const onVisibleChange = jest.fn();

  //   const { baseElement } = renderWithThemeAndServerRouter(
  //     <ProjectNavigation visible={true} onVisibleChange={onVisibleChange}>
  //       {children}
  //     </ProjectNavigation>,
  //     undefined,
  //     { history }
  //   );

  //   expect(screen.queryAllByTestId('search-loading')[0]).toBeUndefined();

  //   fireEvent.change(screen.getAllByTestId('search-project-input')[0], {
  //     target: { value: 'd' },
  //   });

  //   expect(screen.queryAllByTestId('search-loading')[0]).toBeInTheDocument();

  //   await sleep(400);

  //   expect(screen.queryAllByTestId('search-loading')[0]).toBeUndefined();
  //   expect(baseElement).toMatchSnapshot();

  //   fireEvent.change(screen.getAllByTestId('search-project-input')[0], {
  //     target: { value: '' },
  //   });

  //   await sleep(400);

  //   expect(
  //     screen.queryAllByText(
  //       'projectManage.projectList.searchProject.notRecentlyOpenedProjects'
  //     )[0]
  //   ).toBeInTheDocument();

  //   fireEvent.change(screen.getAllByTestId('search-project-input')[0], {
  //     target: { value: 'd' },
  //   });

  //   expect(screen.queryAllByTestId('search-loading')[0]).toBeInTheDocument();

  //   await sleep(400);

  //   fireEvent.click(screen.getAllByText('default')[0]);

  //   expect(history.location.pathname).toBe('/project/default');

  //   expect(onVisibleChange).toBeCalledTimes(1);
  //   expect(onVisibleChange).toBeCalledWith(false);
  // });

  // test('should jump to project list page when click show all projects', () => {
  //   const history = createMemoryHistory();
  //   const onVisibleChange = jest.fn();

  //   renderWithThemeAndServerRouter(
  //     <ProjectNavigation visible={true} onVisibleChange={onVisibleChange}>
  //       {children}
  //     </ProjectNavigation>,
  //     undefined,
  //     { history }
  //   );

  //   fireEvent.click(screen.getByText('projectManage.projectList.allProject'));

  //   expect(history.location.pathname).toBe('/project');
  //   expect(onVisibleChange).toBeCalledTimes(1);
  //   expect(onVisibleChange).toBeCalledWith(false);
  // });
});
