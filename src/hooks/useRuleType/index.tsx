import { useBoolean } from 'ahooks';
import { Select, Space } from 'antd';
import React from 'react';
import { IRuleTypeV1 } from '../../api/common';
import { ResponseCode } from '../../data/common';
import rule_template from '../../api/rule_template';

const useRuleType = () => {
  const [ruleTypeList, setRuleTypeList] = React.useState<IRuleTypeV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateRuleTypeList = React.useCallback(
    (dbType: string) => {
      setTrue();
      rule_template
        .getRuleTypeByDBTypeV1({
          db_type: dbType,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setRuleTypeList(res.data?.data ?? []);
          } else {
            setRuleTypeList([]);
          }
        })
        .catch(() => {
          setRuleTypeList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateRuleTypeSelectOption = React.useCallback(() => {
    return ruleTypeList.map((v) => {
      return (
        <Select.Option key={v.rule_type} value={v.rule_type ?? ''}>
          <Space size={6}>
            <span>{v.rule_type}</span>
            <span>{v.rule_count ? `(${v.rule_count})` : ''}</span>
          </Space>
        </Select.Option>
      );
    });
  }, [ruleTypeList]);

  return {
    ruleTypeList,
    loading,
    updateRuleTypeList,
    generateRuleTypeSelectOption,
  };
};

export default useRuleType;
