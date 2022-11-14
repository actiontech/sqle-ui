import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, Result, Row, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { cloneDeep } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IRuleReqV1, IRuleResV1 } from '../../../api/common';
import ruleTemplate from '../../../api/rule_template';
import { ResponseCode } from '../../../data/common';
import RuleTemplateForm from '../RuleTemplateForm';
import { RuleTemplateBaseInfoFields } from '../RuleTemplateForm/BaseInfoForm/index.type';

const CreateRuleTemplate = () => {
  const { t } = useTranslation();
  const [step, setStep] = React.useState(0);
  const [form] = useForm<RuleTemplateBaseInfoFields>();
  const [createLoading, { toggle: updateCreateLoading }] = useBoolean();
  const [activeRule, setActiveRule] = React.useState<IRuleResV1[]>([]);
  const [databaseRule, setDatabaseRule] = React.useState<IRuleResV1[]>([]);
  const { data: allRules, loading: getAllRulesLoading } = useRequest(
    ruleTemplate.getRuleListV1.bind(ruleTemplate),
    {
      formatResult(res) {
        return res.data.data ?? [];
      },
    }
  );

  const baseInfoFormSubmit = React.useCallback(async () => {
    const values = await form.validateFields();
    const tempAllRules =
      allRules?.filter((e) => e.db_type === values.db_type) ?? [];
    setDatabaseRule(tempAllRules);
    setActiveRule(cloneDeep(tempAllRules));
    setStep(step + 1);
  }, [form, step, allRules]);

  const prevStep = React.useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const submit = React.useCallback(() => {
    updateCreateLoading(true);
    const baseInfo = form.getFieldsValue();
    const activeRuleWithNewField: IRuleReqV1[] = activeRule.map((rule) => {
      return {
        name: rule.rule_name,
        level: rule.level,
        params: !!rule.params
          ? rule.params.map((v) => ({ key: v.key, value: v.value }))
          : [],
      };
    });
    ruleTemplate
      .createRuleTemplateV1({
        rule_template_name: baseInfo.templateName,
        desc: baseInfo.templateDesc,
        db_type: baseInfo.db_type,
        rule_list: activeRuleWithNewField,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setStep(step + 1);
        }
      })
      .finally(() => {
        updateCreateLoading(false);
      });
  }, [activeRule, form, step, updateCreateLoading]);

  const resetAll = React.useCallback(() => {
    setStep(0);
    form.resetFields();
    setActiveRule([...(allRules ?? [])]);
  }, [allRules, form]);
  return (
    <>
      <Card
        title={t('ruleTemplate.createRuleTemplate.title')}
        extra={[
          <Link to="/global/rule/template" key="back">
            <Button type="primary">{t('common.back')}</Button>
          </Link>,
        ]}
      >
        <RuleTemplateForm
          form={form}
          activeRule={activeRule}
          allRules={databaseRule ?? []}
          ruleListLoading={getAllRulesLoading}
          submitLoading={createLoading}
          step={step}
          updateActiveRule={setActiveRule}
          baseInfoSubmit={baseInfoFormSubmit}
          prevStep={prevStep}
          submit={submit}
        >
          <Result
            status="success"
            title={t('ruleTemplate.createRuleTemplate.successTitle')}
            subTitle={
              <Typography.Link
                type="secondary"
                className="pointer"
                onClick={resetAll}
              >
                {t('ruleTemplate.createRuleTemplate.createNew')}
              </Typography.Link>
            }
          />
          <Row justify="center">
            <Link to="/global/rule/template">
              <Button type="primary">{t('ruleTemplate.backToList')}</Button>
            </Link>
          </Row>
        </RuleTemplateForm>
      </Card>
    </>
  );
};

export default CreateRuleTemplate;
