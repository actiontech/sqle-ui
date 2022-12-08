import { useBoolean } from 'ahooks';
import { Select, Tooltip } from 'antd';
import React from 'react';
import { IUserGroupTipListItem } from '../../api/common';
import user_group from '../../api/user_group';
import EmptyBox from '../../components/EmptyBox';
import { ResponseCode } from '../../data/common';

const useUserGroup = () => {
  const [userGroupList, setUserGroupList] = React.useState<
    IUserGroupTipListItem[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateUserGroupList = React.useCallback(
    (projectName?: string) => {
      setTrue();
      user_group
        .getUserGroupTipListV1({
          filter_project: projectName,
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
    },
    [setFalse, setTrue]
  );

  const generateUserGroupSelectOption = React.useCallback(
    (params?: { showTooltip?: boolean }) => {
      const { showTooltip = false } = params ?? {};
      return userGroupList.map((userGroup) => {
        return (
          <Select.Option
            key={userGroup.user_group_name}
            value={userGroup.user_group_name ?? ''}
          >
            <EmptyBox
              if={showTooltip && (userGroup.user_names?.length ?? 0) > 0}
              defaultNode={userGroup.user_group_name}
            >
              <Tooltip
                placement="right"
                title={
                  <>
                    {userGroup.user_names?.slice(0, 15)?.join(', ')}
                    {(userGroup.user_names?.length ?? 0) > 15 ? '...' : ''}
                  </>
                }
              >
                <div className="full-width-element">
                  {userGroup.user_group_name}
                </div>
              </Tooltip>
            </EmptyBox>
          </Select.Option>
        );
      });
    },
    [userGroupList]
  );

  return {
    userGroupList,
    loading,
    updateUserGroupList,
    generateUserGroupSelectOption,
  };
};

export default useUserGroup;
