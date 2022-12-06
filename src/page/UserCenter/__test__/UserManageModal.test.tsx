import { render } from '@testing-library/react';
import { ModalName } from '../../../data/ModalName';
import { mockUseDispatch, mockUseSelector } from '../../../testUtils/mockRedux';
import UserManageModal from '../UserManageModal';

describe('test UserManageModal', () => {
  test('should call "initUserManageModalStatus" when render modal', () => {
    const dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseSelector({
      userManage: { modalStatus: {} },
    });

    expect(dispatchSpy).toBeCalledTimes(0);

    render(<UserManageModal />);

    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'user/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Add_User]: false,
          [ModalName.Update_User]: false,
          [ModalName.Add_Role]: false,
          [ModalName.Update_Role]: false,
          [ModalName.Add_User_Group]: false,
          [ModalName.Update_User_Group]: false,
          [ModalName.Update_User_Password]: false,
        },
      },
    });
  });
});
