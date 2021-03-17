import React from 'react';
import { useBoolean } from 'ahooks';
import { IRoleTipResV1 } from '../../api/common';
import role from '../../api/role';
import { ResponseCode } from '../../data/common';

const useRole = () => {
  const [roleList, setRoleList] = React.useState<IRoleTipResV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateRoleList = React.useCallback(() => {
    setTrue();
    role
      .getRoleTipListV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setRoleList(res.data?.data ?? []);
        } else {
          setRoleList([]);
        }
      })
      .catch(() => {
        setRoleList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  return {
    roleList,
    loading,
    updateRoleList,
  };
};

export default useRole;
