import { render } from '@testing-library/react';
import ProjectManageModal from '..';
import { ModalName } from '../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';

describe('test Project/Modal', () => {
  let dispatchSpy: jest.Mock;

  beforeEach(() => {
    const { scopeDispatch } = mockUseDispatch();
    dispatchSpy = scopeDispatch;

    mockUseSelector({
      projectManage: {
        modalStatus: {
          [ModalName.Update_Project]: false,
          [ModalName.Create_Project]: false,
        },
        selectProject: { name: 'name', desc: 'desc', id: 1 },
      },
    });
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
