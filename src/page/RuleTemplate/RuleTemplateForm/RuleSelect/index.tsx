import { Button, Descriptions, Divider } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IRuleResV1 } from '../../../../api/common';
import RuleList from '../../../../components/RuleList';
import { RuleSelectProps } from './index.type';

const RuleSelect: React.FC<RuleSelectProps> = (props) => {
  const { t } = useTranslation();

  const disableRule = React.useMemo(() => {
    return (
      props.allRules?.filter(
        (e) => !props.activeRule?.find((item) => item.rule_name === e.rule_name)
      ) ?? []
    );
  }, [props.activeRule, props.allRules]);

  const updateRule = React.useCallback(
    (ruleItem: IRuleResV1, isDelete = false) => {
      let temp: IRuleResV1[] = [];
      if (isDelete) {
        temp = props.activeRule.filter(
          (e) => e.rule_name !== ruleItem.rule_name
        );
      } else {
        temp = [...props.activeRule];
        temp.push(ruleItem);
      }
      props.updateActiveRule(temp);
    },
    [props]
  );

  const updateAllRule = React.useCallback(
    (active: boolean) => {
      if (active) {
        props.updateActiveRule([...(props.allRules ?? [])]);
      } else {
        props.updateActiveRule([]);
      }
    },
    [props]
  );

  return (
    <>
      <Descriptions
        title={t('ruleTemplate.ruleTemplateForm.activeRuleTitle')}
        extra={[
          <Button
            key="disable-all"
            danger
            type="primary"
            disabled={props.activeRule.length === 0}
            onClick={updateAllRule.bind(null, false)}
          >
            {t('ruleTemplate.ruleTemplateForm.disableAllRules')}
          </Button>,
        ]}
      />
      <RuleList
        list={props.activeRule ?? []}
        listProps={{ loading: props.listLoading }}
        actions={(item) => {
          return [
            <Button
              onClick={updateRule.bind(null, item, true)}
              key={`${item.rule_name}-disable-item`}
              type="link"
              danger
            >
              {t('ruleTemplate.ruleTemplateForm.disableRule')}
            </Button>,
          ];
        }}
      />
      <Divider dashed={true} />
      <Descriptions
        title={t('ruleTemplate.ruleTemplateForm.disableRuleTitle')}
        extra={[
          <Button
            key="active-all"
            type="primary"
            disabled={disableRule.length === 0}
            onClick={updateAllRule.bind(null, true)}
          >
            {t('ruleTemplate.ruleTemplateForm.activeAllRules')}
          </Button>,
        ]}
      />
      <RuleList
        list={disableRule}
        listProps={{ loading: props.listLoading }}
        actions={(item) => {
          return [
            <Button
              onClick={updateRule.bind(null, item, false)}
              key={`${item.rule_name}-active-item`}
              type="link"
            >
              {t('ruleTemplate.ruleTemplateForm.activeRule')}
            </Button>,
          ];
        }}
      />
    </>
  );
};

export default RuleSelect;
