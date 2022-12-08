import React from 'react';
import { useBoolean } from 'ahooks';
import { IMemberTipResV1 } from '../../api/common';
import user from '../../api/user';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';

const useMember = () => {
  const [memberList, setMemberList] = React.useState<IMemberTipResV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateMemberList = React.useCallback(
    (projectName: string) => {
      setTrue();
      user
        .getMemberTipListV1({ project_name: projectName })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setMemberList(res.data?.data ?? []);
          } else {
            setMemberList([]);
          }
        })
        .catch(() => {
          setMemberList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateMemberSelectOption = React.useCallback(() => {
    return memberList.map((member) => {
      return (
        <Select.Option key={member.user_name} value={member.user_name ?? ''}>
          {member.user_name}
        </Select.Option>
      );
    });
  }, [memberList]);

  return {
    memberList,
    loading,
    updateMemberList,
    generateMemberSelectOption,
  };
};

export default useMember;
