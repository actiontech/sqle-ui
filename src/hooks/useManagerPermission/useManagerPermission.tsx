import { useCallback, useState } from 'react';
import { useBoolean } from 'ahooks';
import { IManagementPermission } from '../../api/common';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import management_permission from '../../api/management_permission';

const useManagerPermission = () => {
  const [managerPermissionList, setManagerPermissionList] = useState<
    IManagementPermission[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateManagerPermission = useCallback(() => {
    setTrue();
    management_permission
      .GetManagementPermissionsV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setManagerPermissionList(res.data?.data ?? []);
        } else {
          setManagerPermissionList([]);
        }
      })
      .catch(() => {
        setManagerPermissionList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateManagerPermissionSelectOption = useCallback(() => {
    return managerPermissionList.map((v) => {
      return (
        <Select.Option key={v.code} value={v.code ?? ''}>
          {v.desc}
        </Select.Option>
      );
    });
  }, [managerPermissionList]);

  return {
    managerPermissionList,
    loading,
    updateManagerPermission,
    generateManagerPermissionSelectOption,
  };
};

export default useManagerPermission;
