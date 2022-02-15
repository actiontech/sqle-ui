import { useEffect } from 'react';
import useRole from '../../../../../hooks/useRole';
import useUsername from '../../../../../hooks/useUsername';

const useUserGroupFormOption = (visible: boolean) => {
  const { roleList, updateRoleList } = useRole();
  const { usernameList, updateUsernameList } = useUsername();

  useEffect(() => {
    if (visible) {
      updateRoleList();
      updateUsernameList();
    }
  }, [updateRoleList, updateUsernameList, visible]);

  return {
    roleList,
    usernameList,
  };
};

export default useUserGroupFormOption;
