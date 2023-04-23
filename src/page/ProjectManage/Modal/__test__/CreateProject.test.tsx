import { act, fireEvent, render, screen } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockCreateProject } from '../../__test__/utils';
import CreateProject from '../CreateProject';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('test ProjectManage/Modal/CreateProject', () => {
  const dispatchSpy = jest.fn();

  let createProjectSpy: jest.SpyInstance;
  let emitSpy: jest.SpyInstance;
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        projectManage: { modalStatus: { [ModalName.Create_Project]: true } },
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);

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
    await act(async () => jest.advanceTimersByTime(0));

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

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText('projectManage.createProject.createSuccessTips')
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
