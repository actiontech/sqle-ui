import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import React from 'react';
import { IUserGroupTipListItem } from '../../api/common';
import user_group from '../../api/user_group';
import { ResponseCode } from '../../data/common';

const useUserGroup = () => {
  const [userGroupList, setUserGroupList] = React.useState<
    IUserGroupTipListItem[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateUserGroupList = React.useCallback(() => {
    setTrue();
    user_group
      .getUserGroupTipListV1({
        //todo
        filter_project: undefined,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setUserGroupList(res.data?.data ?? []);
        } else {
          setUserGroupList([]);
        }
      })
      .catch(() => {
        setUserGroupList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateUserGroupSelectOption = React.useCallback(() => {
    return userGroupList.map((userGroup) => {
      return (
        <Select.Option
          key={userGroup.user_group_name}
          value={userGroup.user_group_name ?? ''}
        >
          {userGroup.user_group_name}
        </Select.Option>
      );
    });
  }, [userGroupList]);

  return {
    userGroupList,
    loading,
    updateUserGroupList,
    generateUserGroupSelectOption,
  };
};

export default useUserGroup;
