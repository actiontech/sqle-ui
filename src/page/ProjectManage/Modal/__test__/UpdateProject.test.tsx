import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockUpdateProject } from '../../__test__/utils';
import UpdateProject from '../UpdateProject';

describe('test ProjectManage/Modal/UpdateProject', () => {
  let dispatchSpy: jest.Mock;
  let updateProjectSpy: jest.SpyInstance;
  let emitSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseSelector({
      projectManage: {
        modalStatus: { [ModalName.Update_Project]: true },
        selectProject: { name: 'name', desc: 'desc', id: 1 },
      },
    });
    const { scopeDispatch } = mockUseDispatch();
    dispatchSpy = scopeDispatch;
    updateProjectSpy = mockUpdateProject();
    emitSpy = jest.spyOn(EventEmitter, 'emit');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', () => {
    const { baseElement } = render(<UpdateProject />);

    expect(baseElement).toMatchSnapshot();
  });

  test('should set form fields value when opened modal', () => {
    render(<UpdateProject />);
    expect(
      screen.getByLabelText('projectManage.projectForm.projectName')
    ).toHaveValue('name');
    expect(
      screen.getByLabelText('projectManage.projectForm.projectName')
    ).toBeDisabled();
    expect(
      screen.getByLabelText('projectManage.projectForm.projectDesc')
    ).toHaveValue('desc');
  });

  test('should send update project request when user click submit button', async () => {
    render(<UpdateProject />);

    expect(updateProjectSpy).toBeCalledTimes(0);

    fireEvent.input(
      screen.getByLabelText('projectManage.projectForm.projectDesc'),
      {
        target: { value: 'update_desc' },
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

    expect(updateProjectSpy).toBeCalledTimes(1);
    expect(updateProjectSpy).toBeCalledWith({
      project_name: 'name',
      desc: 'update_desc',
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('projectManage.updateProject.updateSuccessTips')
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
        modalName: ModalName.Update_Project,
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
