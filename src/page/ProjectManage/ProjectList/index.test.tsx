import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import ProjectList from '.';
import { SystemRole } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { mockManagementPermissions } from '../../../hooks/useCurrentUser/index.test';
import { getBySelector } from '../../../testUtils/customQuery';
import { renderWithRouter } from '../../../testUtils/customRender';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import EventEmitter from '../../../utils/EventEmitter';
import { mockDeleteProject, mockGetProjectList } from '../__test__/utils';

describe('test ProjectManage/ProjectList', () => {
  let getProjectListSpy: jest.SpyInstance;
  let deleteProjectList: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseSelector({
      projectManage: {
        modalStatus: {
          [ModalName.Create_Project]: false,
          [ModalName.Update_Project]: false,
        },
      },
      user: {
        role: SystemRole.admin,
        bindProjects: [],
        managementPermissions: [],
      },
    });
    getProjectListSpy = mockGetProjectList();
    deleteProjectList = mockDeleteProject();
    const { scopeDispatch } = mockUseDispatch();
    dispatchSpy = scopeDispatch;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should be get data from the request to render the table', async () => {
    expect(getProjectListSpy).toBeCalledTimes(0);
    const { container } = renderWithRouter(<ProjectList />);
    expect(container).toMatchSnapshot();
    expect(getProjectListSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should be refresh table when clicking refresh button', async () => {
    expect(getProjectListSpy).toBeCalledTimes(0);
    renderWithRouter(<ProjectList />);
    expect(getProjectListSpy).toBeCalledTimes(1);
    expect(getProjectListSpy).nthCalledWith(1, {
      page_index: 1,
      page_size: 10,
    });
    expect(screen.getByTestId('refresh-project').children[0]).toHaveClass(
      'anticon-spin'
    );

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId('refresh-project').children[0]).not.toHaveClass(
      'anticon-spin'
    );

    fireEvent.click(screen.getByTestId('refresh-project'));
    expect(getProjectListSpy).toBeCalledTimes(2);
  });

  test('should open the modal for creating a project when click the Create Project button', () => {
    renderWithRouter(<ProjectList />);
    expect(dispatchSpy).toBeCalledTimes(1);

    fireEvent.click(
      screen.getByText('projectManage.projectList.createProject')
    );

    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).toBeCalledWith({
      type: 'projectManage/updateModalStatus',
      payload: {
        modalName: ModalName.Create_Project,
        status: true,
      },
    });
  });

  test('should be called delete request when clicking the delete button', async () => {
    renderWithRouter(<ProjectList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(deleteProjectList).toBeCalledTimes(0);

    expect(screen.getAllByText('common.delete')[0]).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('common.delete')[0]);
    expect(
      screen.getByText('projectManage.projectList.column.deleteProjectTips')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.ok'));
    expect(deleteProjectList).toBeCalledTimes(1);
    expect(deleteProjectList).toBeCalledWith({ project_name: 'project1' });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('projectManage.projectList.deleteSuccessTips')
    ).toBeInTheDocument();
    expect(getProjectListSpy).toBeCalledTimes(2);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('projectManage.projectList.deleteSuccessTips')
    ).not.toBeInTheDocument();
  });

  test('should open the modal for updating a project when click the Update Project button', async () => {
    renderWithRouter(<ProjectList />);
    expect(dispatchSpy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getAllByText('common.edit')[0]).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('common.edit')[0]);

    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).toBeCalledWith({
      type: 'projectManage/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Project,
        status: true,
      },
    });
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        project: {
          create_time: '2022-11-01',
          create_user_name: 'admin',
          desc: 'desc1',
          id: 1,
          name: 'project1',
        },
      },
      type: 'projectManage/updateSelectProject',
    });
  });

  test('should refresh table data when receive "Refresh_User_list" event', async () => {
    renderWithRouter(<ProjectList />);
    expect(getProjectListSpy).toBeCalledTimes(1);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Project_List);
    });
    expect(getProjectListSpy).toBeCalledTimes(2);
    expect(getProjectListSpy).nthCalledWith(2, {
      page_index: 1,
      page_size: 10,
    });
  });

  test('should jump to next page when user click next page button', async () => {
    renderWithRouter(<ProjectList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(getBySelector('.ant-pagination-next'));
    expect(getProjectListSpy).toBeCalledWith({
      page_index: 2,
      page_size: 10,
    });
    fireEvent.click(getBySelector('.ant-pagination-prev'));
    expect(getProjectListSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
    });
  });

  test('should hide the Create feature when project permissions are not created and the is not a admin', async () => {
    mockUseSelector({
      projectManage: {
        modalStatus: {
          [ModalName.Create_Project]: false,
          [ModalName.Update_Project]: false,
        },
      },
      user: {
        role: SystemRole.admin,
        bindProjects: [],
        managementPermissions: [],
      },
    });

    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('projectManage.projectList.createProject')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      projectManage: {
        modalStatus: {
          [ModalName.Create_Project]: false,
          [ModalName.Update_Project]: false,
        },
      },
      user: {
        role: '',
        bindProjects: [],
        managementPermissions: mockManagementPermissions,
      },
    });
    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('projectManage.projectList.createProject')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      projectManage: {
        modalStatus: {
          [ModalName.Create_Project]: false,
          [ModalName.Update_Project]: false,
        },
      },
      user: {
        role: '',
        bindProjects: [],
        managementPermissions: [],
      },
    });
    renderWithRouter(<ProjectList />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('projectManage.projectList.createProject')
    ).not.toBeInTheDocument();
  });

  test('should disabled the Delete, Edit feature when not currently a project manager or admin', async () => {
    mockUseSelector({
      projectManage: {
        modalStatus: {
          [ModalName.Create_Project]: false,
          [ModalName.Update_Project]: false,
        },
      },
      user: {
        role: '',
        bindProjects: [],
        managementPermissions: [],
      },
    });

    renderWithRouter(<ProjectList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).toHaveClass(
      'ant-typography-disabled'
    );
    fireEvent.click(screen.queryAllByText('common.delete')[0]);
    expect(
      screen.queryByText('projectManage.projectList.column.deleteProjectTips')
    ).not.toBeInTheDocument();

    expect(screen.queryAllByText('common.edit')[0]).toHaveClass(
      'ant-typography-disabled'
    );

    expect(dispatchSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getAllByText('common.edit')[0]);
    expect(dispatchSpy).toBeCalledTimes(1);

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      projectManage: {
        modalStatus: {
          [ModalName.Create_Project]: false,
          [ModalName.Update_Project]: false,
        },
      },
      user: {
        role: SystemRole.admin,
        bindProjects: [],
        managementPermissions: [],
      },
    });
    renderWithRouter(<ProjectList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).not.toHaveClass(
      'ant-typography-disabled'
    );
    fireEvent.click(screen.queryAllByText('common.delete')[0]);
    expect(
      screen.queryByText('projectManage.projectList.column.deleteProjectTips')
    ).toBeInTheDocument();

    expect(screen.queryAllByText('common.edit')[0]).not.toHaveClass(
      'ant-typography-disabled'
    );

    expect(dispatchSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getAllByText('common.edit')[0]);
    expect(dispatchSpy).toBeCalledTimes(3);

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      projectManage: {
        modalStatus: {
          [ModalName.Create_Project]: false,
          [ModalName.Update_Project]: false,
        },
      },
      user: {
        role: '',
        bindProjects: [{ project_name: 'project1', is_manager: true }],
        managementPermissions: [],
      },
    });
    renderWithRouter(<ProjectList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryAllByText('common.delete')[0]).not.toHaveClass(
      'ant-typography-disabled'
    );
    fireEvent.click(screen.queryAllByText('common.delete')[0]);
    expect(
      screen.queryByText('projectManage.projectList.column.deleteProjectTips')
    ).toBeInTheDocument();

    expect(screen.queryAllByText('common.edit')[0]).not.toHaveClass(
      'ant-typography-disabled'
    );

    expect(dispatchSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getAllByText('common.edit')[0]);
    expect(dispatchSpy).toBeCalledTimes(3);

    cleanup();
    jest.clearAllMocks();
  });
});
