import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../data/ModalName';
import { initUserManageModalStatus } from '../../store/userManage';
import RoleModal from './Role/Modal';
import UserModal from './User/Modal';
import UserGroupModal from './UserGroup/Modal';

const UserManageModal: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initUserManageModalStatus({
        modalStatus: {
          [ModalName.Add_User]: false,
          [ModalName.Update_User]: false,
          [ModalName.Add_Role]: false,
          [ModalName.Update_Role]: false,
          [ModalName.Add_User_Group]: false,
          [ModalName.Update_User_Group]: false,
          [ModalName.Update_User_Password]: false,
        },
      })
    );
  }, [dispatch]);

  return (
    <>
      <UserModal />
      <RoleModal />
      <UserGroupModal />
    </>
  );
};

export default UserManageModal;
