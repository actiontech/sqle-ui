import React from 'react';
import { useBoolean } from 'ahooks';
import { IRoleTipResV1 } from '../../api/common';
import role from '../../api/role';
import { ResponseCode } from '../../data/common';
import { Select, Tooltip } from 'antd';
import EmptyBox from '../../components/EmptyBox';

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

  const generateRoleSelectOption = React.useCallback(
    (params?: { showTooltip?: boolean }) => {
      const { showTooltip = false } = params ?? {};
      return roleList.map((role) => {
        return (
          <Select.Option key={role.role_name} value={role.role_name ?? ''}>
            <EmptyBox
              if={showTooltip && (role.operations?.length ?? 0) > 0}
              defaultNode={role.role_name}
            >
              <Tooltip
                placement="right"
                title={
                  <>
                    {role.operations
                      ?.map((v) => v.op_desc)
                      ?.slice(0, 15)
                      ?.join(', ')}
                    {(role.operations?.length ?? 0) > 15 ? '...' : ''}
                  </>
                }
              >
                <div className="full-width-element">{role.role_name}</div>
              </Tooltip>
            </EmptyBox>
          </Select.Option>
        );
      });
    },
    [roleList]
  );

  return {
    roleList,
    loading,
    updateRoleList,
    generateRoleSelectOption,
  };
};

export default useRole;
