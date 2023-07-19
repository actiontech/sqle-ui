import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, Result, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  IRuleReqV1,
  IRuleResV1,
  IRuleTemplateDetailResV1,
} from '../../../api/common';
import ruleTemplateService from '../../../api/rule_template';
import { ResponseCode } from '../../../data/common';
import RuleTemplateForm from '../RuleTemplateForm';
import { RuleTemplateBaseInfoFields } from '../RuleTemplateForm/BaseInfoForm/index.type';
import { Link } from '../../../components/Link';
import BackButton from '../../../components/BackButton';

const UpdateRuleTemplate = () => {
  const { t } = useTranslation();
  const [step, setStep] = React.useState(0);
  const [form] = useForm<RuleTemplateBaseInfoFields>();
  const [
    updateTemplateLoading,
    { setTrue: startSubmit, setFalse: finishSubmit },
  ] = useBoolean();
  const [activeRule, setActiveRule] = React.useState<IRuleResV1[]>([]);
  const [databaseRule, setDatabaseRule] = React.useState<IRuleResV1[]>([]);
  const [ruleTemplate, setRuleTemplate] = React.useState<
    IRuleTemplateDetailResV1 | undefined
  >();
  const urlParams = useParams<{ templateName: string }>();
  const { data: allRules, loading: getAllRulesLoading } = useRequest(() =>
    ruleTemplateService.getRuleListV1({}).then((res) => res.data.data ?? [])
  );

  const baseInfoFormSubmit = React.useCallback(async () => {
    const values = await form.validateFields();
    setDatabaseRule(
      allRules?.filter((e) => e.db_type === values.db_type) ?? []
    );
    setStep(step + 1);
  }, [form, step, allRules]);

  const prevStep = React.useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const submit = React.useCallback(() => {
    startSubmit();
    const baseInfo = form.getFieldsValue();
    const activeRuleWithNewField: IRuleReqV1[] = activeRule.map<IRuleReqV1>(
      (rule) => {
        return {
          is_custom_rule: !!rule.is_custom_rule,
          name: rule.rule_name,
          level: rule.level,
          params: !!rule.params
            ? rule.params.map((v) => ({ key: v.key, value: v.value }))
            : [],
        };
      }
    );
    ruleTemplateService
      .updateRuleTemplateV1({
        rule_template_name: baseInfo.templateName,
        desc: baseInfo.templateDesc,
        rule_list: activeRuleWithNewField,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setStep(step + 1);
        }
      })
      .finally(() => {
        finishSubmit();
      });
  }, [activeRule, finishSubmit, form, startSubmit, step]);

  React.useEffect(() => {
    ruleTemplateService
      .getRuleTemplateV1({
        rule_template_name: urlParams.templateName ?? '',
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const template = res.data.data;
          setRuleTemplate(template);
          setActiveRule(template?.rule_list ?? []);
        }
      });
  }, [urlParams.templateName]);

  return (
    <>
      <Card
        title={t('ruleTemplate.updateRuleTemplate.title')}
        extra={[<BackButton key="back" />]}
      >
        <RuleTemplateForm
          form={form}
          activeRule={activeRule}
          allRules={databaseRule ?? []}
          ruleListLoading={getAllRulesLoading}
          submitLoading={updateTemplateLoading}
          step={step}
          updateActiveRule={setActiveRule}
          baseInfoSubmit={baseInfoFormSubmit}
          prevStep={prevStep}
          submit={submit}
          defaultData={ruleTemplate}
          mode="update"
        >
          <Result
            status="success"
            title={t('ruleTemplate.updateRuleTemplate.successTitle', {
              name: urlParams.templateName,
            })}
          />
          <Row justify="center">
            <Link to="rule/template">
              <Button type="primary">{t('ruleTemplate.backToList')}</Button>
            </Link>
          </Row>
        </RuleTemplateForm>
      </Card>
    </>
  );
};

export default UpdateRuleTemplate;
