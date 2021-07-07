import AddRole from './AddRole';
import AddUser from './AddUser';
import ModifyUserPassword from './ModifyUserPassword';
import UpdateRole from './UpdateRole';
import UpdateUser from './UpdateUser';

const UserManageModal = () => {
  return (
    <>
      <AddRole />
      <UpdateRole />
      <AddUser />
      <UpdateUser />
      <ModifyUserPassword />
    </>
  );
};

export default UserManageModal;
