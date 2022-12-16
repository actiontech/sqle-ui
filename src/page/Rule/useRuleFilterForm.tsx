import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { IRuleResV1 } from '../../api/common';
import useDatabaseType from '../../hooks/useDatabaseType';
import useGlobalRuleTemplate from '../../hooks/useGlobalRuleTemplate';
import useProject from '../../hooks/useProject';
import useRuleTemplate from '../../hooks/useRuleTemplate';

export enum RuleUrlParamKey {
  projectName = 'projectName',
  ruleTemplateName = 'ruleTemplateName',
}

const useRuleFilterForm = (
  getProjectTemplateRules: (
    projectName?: string,
    ruleTemplateName?: string
  ) => Promise<IRuleResV1[]>,
  getGlobalTemplateRules: (ruleTemplateName?: string) => Promise<IRuleResV1[]>
) => {
  const { t } = useTranslation();
  const location = useLocation();

  const [dbType, setDbType] = useState<string | undefined>(undefined);
  const { updateDriverNameList, driverNameList, generateDriverSelectOptions } =
    useDatabaseType();
  const { updateProjectList, generateProjectSelectOption } = useProject();
  const { ruleTemplateList, updateRuleTemplateList } = useRuleTemplate();
  const { globalRuleTemplateList, updateGlobalRuleTemplateList } =
    useGlobalRuleTemplate();

  const [projectName, setProjectName] = useState<string>();
  const [ruleTemplateName, setRuleTemplateName] = useState<string>();

  const projectNameChangeHandle = (name: string) => {
    setProjectName(name);
    setRuleTemplateName(undefined);
    if (name) {
      updateRuleTemplateList(name);
    }
  };

  const ruleTemplateNameChangeHandle = (name: string) => {
    setRuleTemplateName(name);
    if (!name) {
      return;
    }
    if (projectName) {
      getProjectTemplateRules(projectName, name);
    } else {
      getGlobalTemplateRules(name);
    }
  };

  const generateRuleTemplateSelectOptions = () => {
    const list = projectName ? ruleTemplateList : globalRuleTemplateList;
    const groupLabel = projectName
      ? t('rule.projectRuleTemplate')
      : t('rule.globalRuleTemplate');

    if (list.length === 0) {
      return null;
    }

    return (
      <Select.OptGroup label={groupLabel}>
        {list.map((v) => {
          return (
            <Select.Option
              key={v.rule_template_name}
              value={v.rule_template_name ?? ''}
            >
              {v.rule_template_name}
            </Select.Option>
          );
        })}
      </Select.OptGroup>
    );
  };

  useEffect(() => {
    updateGlobalRuleTemplateList();
    updateDriverNameList();
    updateProjectList();
  }, [updateDriverNameList, updateGlobalRuleTemplateList, updateProjectList]);

  useEffect(() => {
    if (driverNameList.length > 0 && !dbType) {
      setDbType(driverNameList[0]);
    }
  }, [driverNameList, dbType]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const projectNameInUrl = searchParams.get(RuleUrlParamKey.projectName);
    const ruleTemplateNameInUrl = searchParams.get(
      RuleUrlParamKey.ruleTemplateName
    );
    if (projectNameInUrl) {
      setProjectName(projectNameInUrl);
      updateRuleTemplateList(projectNameInUrl);
    }

    if (ruleTemplateNameInUrl) {
      setRuleTemplateName(ruleTemplateNameInUrl);
      projectNameInUrl
        ? getProjectTemplateRules(projectNameInUrl, ruleTemplateNameInUrl)
        : getGlobalTemplateRules(ruleTemplateNameInUrl);
    }
  }, [
    getGlobalTemplateRules,
    getProjectTemplateRules,
    location.search,
    updateRuleTemplateList,
  ]);

  return {
    generateDriverSelectOptions,
    generateProjectSelectOption,
    generateRuleTemplateSelectOptions,
    projectName,
    projectNameChangeHandle,
    dbType,
    setDbType,
    ruleTemplateName,
    ruleTemplateNameChangeHandle,
  };
};

export default useRuleFilterForm;
