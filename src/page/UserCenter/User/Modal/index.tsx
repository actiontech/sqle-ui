import AddUser from './AddUser';
import ModifyUserPassword from './ModifyUserPassword';
import UpdateUser from './UpdateUser';

const UserModal = () => {
  return (
    <>
      <AddUser />
      <UpdateUser />
      <ModifyUserPassword />
    </>
  );
};

export default UserModal;
