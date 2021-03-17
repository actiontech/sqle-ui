import { useBoolean } from 'ahooks';
import React from 'react';
import { IUserTipResV1 } from '../../api/common';
import user from '../../api/user';
import { ResponseCode } from '../../data/common';

const useUsername = () => {
  const [usernameList, setUsernameList] = React.useState<IUserTipResV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateUsernameList = React.useCallback(() => {
    setTrue();
    user
      .getUserTipListV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setUsernameList(res.data?.data ?? []);
        } else {
          setUsernameList([]);
        }
      })
      .catch(() => {
        setUsernameList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  return {
    usernameList,
    loading,
    updateUsernameList,
  };
};

export default useUsername;
