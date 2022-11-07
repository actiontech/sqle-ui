import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import ProjectList from '.';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { getBySelector } from '../../../testUtils/customQuery';
import { renderWithRouter } from '../../../testUtils/customRender';
import { mockUseDispatch } from '../../../testUtils/mockRedux';
import EventEmitter from '../../../utils/EventEmitter';
import { mockDeleteProject, mockGetProjectList } from '../__test__/utils';

describe('test ProjectManage/ProjectList', () => {
  let getProjectListSpy: jest.SpyInstance;
  let deleteProjectList: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  beforeEach(() => {
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
    expect(dispatchSpy).toBeCalledTimes(0);

    fireEvent.click(
      screen.getByText('projectManage.projectList.createProject')
    );

    expect(dispatchSpy).toBeCalledTimes(1);
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
      screen.getByText('ruleTemplate.deleteRuleTemplate.tips')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.ok'));
    expect(deleteProjectList).toBeCalledTimes(1);
    expect(deleteProjectList).toBeCalledWith({ project_id: 1 });
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
    expect(dispatchSpy).toBeCalledTimes(0);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getAllByText('common.edit')[0]).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('common.edit')[0]);

    expect(dispatchSpy).toBeCalledTimes(2);
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
});
