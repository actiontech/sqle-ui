import React from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import audit_plan from '../../api/audit_plan';
import { IAuditPlanTypesV1 } from '../../api/common';

const useAuditPlanTypes = () => {
  const [auditPlanTypes, setAuditPlanTypes] = React.useState<
    IAuditPlanTypesV1[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateAuditPlanTypes = React.useCallback(() => {
    setTrue();
    audit_plan
      .getAuditPlanTypesV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setAuditPlanTypes(res.data?.data ?? []);
        } else {
          setAuditPlanTypes([]);
        }
      })
      .catch(() => {
        setAuditPlanTypes([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateAuditPlanTypesOption = React.useCallback(() => {
    return auditPlanTypes.map((type) => {
      return (
        <Select.Option key={type.type} value={type.type ?? ''}>
          {type.desc}
        </Select.Option>
      );
    });
  }, [auditPlanTypes]);

  return {
    auditPlanTypes,
    loading,
    updateAuditPlanTypes,
    generateAuditPlanTypesOption,
  };
};

export default useAuditPlanTypes;
