import { render } from '@testing-library/react';
import { ModalName } from '../../../data/ModalName';
import UserManageModal from '../UserManageModal';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

describe('test UserManageModal', () => {
  const dispatchSpy = jest.fn();

  test('should call "initUserManageModalStatus" when render modal', () => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);

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
