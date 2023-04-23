import { act, fireEvent, render, screen } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockUpdateProject } from '../../__test__/utils';
import UpdateProject from '../UpdateProject';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('test ProjectManage/Modal/UpdateProject', () => {
  const dispatchSpy = jest.fn();

  let updateProjectSpy: jest.SpyInstance;
  let emitSpy: jest.SpyInstance;
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        projectManage: {
          modalStatus: { [ModalName.Update_Project]: true },
          selectProject: { name: 'name', desc: 'desc', id: 1 },
        },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
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
    await act(async () => jest.advanceTimersByTime(0));

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

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('projectManage.updateProject.updateSuccessTips')
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
