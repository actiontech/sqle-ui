import { useBoolean } from 'ahooks';
import { Select } from 'antd';
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
      .getUserTipListV1({})
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

  const generateUsernameSelectOption = React.useCallback(() => {
    return usernameList.map((user) => {
      return (
        <Select.Option key={user.user_name} value={user.user_name ?? ''}>
          {user.user_name}
        </Select.Option>
      );
    });
  }, [usernameList]);

  return {
    usernameList,
    loading,
    updateUsernameList,
    generateUsernameSelectOption,
  };
};

export default useUsername;
