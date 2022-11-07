import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockCreateProject } from '../../__test__/utils';
import CreateProject from '../CreateProject';

describe('test ProjectManage/Modal/CreateProject', () => {
  let dispatchSpy: jest.Mock;
  let createProjectSpy: jest.SpyInstance;
  let emitSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseSelector({
      projectManage: { modalStatus: { [ModalName.Create_Project]: true } },
    });
    const { scopeDispatch } = mockUseDispatch();
    dispatchSpy = scopeDispatch;
    createProjectSpy = mockCreateProject();
    emitSpy = jest.spyOn(EventEmitter, 'emit');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  test('should match snapshot', () => {
    const { baseElement } = render(<CreateProject />);
    expect(baseElement).toMatchSnapshot();
  });

  test('should send create project request when clicking submit button', async () => {
    render(<CreateProject />);
    expect(createProjectSpy).toBeCalledTimes(0);

    fireEvent.input(
      screen.getByLabelText('projectManage.projectForm.projectName'),
      {
        target: { value: 'name' },
      }
    );
    fireEvent.input(
      screen.getByLabelText('projectManage.projectForm.projectDesc'),
      {
        target: { value: 'desc' },
      }
    );

    fireEvent.click(screen.getByText('common.submit'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('common.submit').parentNode).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).toHaveAttribute(
      'disabled'
    );

    expect(createProjectSpy).toBeCalledTimes(1);
    expect(createProjectSpy).toBeCalledWith({
      name: 'name',
      desc: 'desc',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('projectManage.createProject.createSuccessTips')
    ).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Project_List);
    expect(
      screen.getByLabelText('projectManage.projectForm.projectName')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('projectManage.projectForm.projectDesc')
    ).toHaveValue('');
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: ModalName.Create_Project,
        status: false,
      },
      type: 'projectManage/updateModalStatus',
    });
    expect(screen.getByText('common.submit').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('common.close').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });
});
