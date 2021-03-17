import AddRole from './AddRole';
import AddUser from './AddUser';
import UpdateRole from './UpdateRole';
import UpdateUser from './UpdateUser';

const UserManageModal = () => {
  return (
    <>
      <AddRole />
      <UpdateRole />
      <AddUser />
      <UpdateUser />
    </>
  );
};

export default UserManageModal;
