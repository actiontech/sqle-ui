import { useEffect } from 'react';
import useUsername from '../../../../../hooks/useUsername';

const useUserGroupFormOption = (visible: boolean) => {
  const { usernameList, updateUsernameList } = useUsername();

  useEffect(() => {
    if (visible) {
      updateUsernameList();
    }
  }, [updateUsernameList, visible]);

  return {
    usernameList,
  };
};

export default useUserGroupFormOption;
