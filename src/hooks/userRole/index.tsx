import React from 'react';
import { useBoolean } from 'ahooks';
import { IRoleTipResV1 } from '../../api/common';
import role from '../../api/role';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';

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

  const generateRoleSelectOption = React.useCallback(() => {
    return roleList.map((role) => {
      return (
        <Select.Option key={role.role_name} value={role.role_name ?? ''}>
          {role.role_name}
        </Select.Option>
      );
    });
  }, [roleList]);

  return {
    roleList,
    loading,
    updateRoleList,
    generateRoleSelectOption,
  };
};

export default useRole;
