import React from 'react';
import { useBoolean } from 'ahooks';
import { IRuleTemplateTipResV1 } from '../../api/common';
import { ResponseCode } from '../../data/common';
import ruleTemplate from '../../api/rule_template';
import { Select } from 'antd';
import { ruleTemplateListDefaultKey } from '../../data/common';

const useGlobalRuleTemplate = () => {
  const [globalRuleTemplateList, setRuleTemplate] = React.useState<
    IRuleTemplateTipResV1[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateGlobalRuleTemplateList = React.useCallback(
    (projectName: string) => {
      setTrue();
      ruleTemplate
        .getProjectRuleTemplateTipsV1({ project_name: projectName })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setRuleTemplate(res.data?.data ?? []);
          } else {
            setRuleTemplate([]);
          }
        })
        .catch(() => {
          setRuleTemplate([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateGlobalRuleTemplateSelectOption = React.useCallback(
    (db_type: string = ruleTemplateListDefaultKey) => {
      let filterRuleTemplateList: IRuleTemplateTipResV1[] = [];
      if (db_type !== ruleTemplateListDefaultKey) {
        filterRuleTemplateList = globalRuleTemplateList.filter(
          (i) => i.db_type === db_type
        );
      } else {
        filterRuleTemplateList = globalRuleTemplateList;
      }
      return filterRuleTemplateList.map((template) => {
        return (
          <Select.Option
            key={template.rule_template_name}
            value={template.rule_template_name ?? ''}
          >
            {template.rule_template_name}
          </Select.Option>
        );
      });
    },
    [globalRuleTemplateList]
  );

  return {
    globalRuleTemplateList,
    loading,
    updateGlobalRuleTemplateList,
    generateGlobalRuleTemplateSelectOption,
  };
};

export default useGlobalRuleTemplate;
