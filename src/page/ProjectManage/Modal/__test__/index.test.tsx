import { render } from '@testing-library/react';
import ProjectManageModal from '..';
import { ModalName } from '../../../../data/ModalName';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('test Project/Modal', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        projectManage: {
          modalStatus: {
            [ModalName.Update_Project]: false,
            [ModalName.Create_Project]: false,
          },
          selectProject: { name: 'name', desc: 'desc', id: 1 },
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should init project manage modal status', () => {
    expect(dispatchSpy).toBeCalledTimes(0);
    render(<ProjectManageModal />);

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalStatus: { Create_Project: false, Update_Project: false },
      },
      type: 'projectManage/initModalStatus',
    });
  });
});
