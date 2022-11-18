import { useBoolean, useRequest } from 'ahooks';
import { Button, Card, Result, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  IRuleReqV1,
  IRuleResV1,
  IRuleProjectTemplateDetailResV1,
} from '../../../api/common';
import ruleTemplateService from '../../../api/rule_template';
import { ResponseCode } from '../../../data/common';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import RuleTemplateForm from '../RuleTemplateForm';
import { RuleTemplateBaseInfoFields } from '../RuleTemplateForm/BaseInfoForm/index.type';

const UpdateRuleTemplate = () => {
  const { t } = useTranslation();
  const [step, setStep] = React.useState(0);
  const [form] = useForm<RuleTemplateBaseInfoFields>();
  const [updateTemplateLoading, { toggle: updateLoading }] = useBoolean();
  const [activeRule, setActiveRule] = React.useState<IRuleResV1[]>([]);
  const [databaseRule, setDatabaseRule] = React.useState<IRuleResV1[]>([]);
  const [ruleTemplate, setRuleTemplate] = React.useState<
    IRuleProjectTemplateDetailResV1 | undefined
  >();
  const { projectName } = useCurrentProjectName();
  const urlParams = useParams<{ templateName: string }>();
  const { data: allRules, loading: getAllRulesLoading } = useRequest(
    () => ruleTemplateService.getRuleListV1({}),
    {
      formatResult(res) {
        return res.data.data ?? [];
      },
    }
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
    updateLoading(true);
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
    ruleTemplateService
      .updateProjectRuleTemplateV1({
        rule_template_name: baseInfo.templateName,
        desc: baseInfo.templateDesc,
        rule_list: activeRuleWithNewField,
        project_name: projectName,
        instance_name_list: baseInfo.instances,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setStep(step + 1);
        }
      })
      .finally(() => {
        updateLoading(false);
      });
  }, [activeRule, form, projectName, step, updateLoading]);

  React.useEffect(() => {
    ruleTemplateService
      .getProjectRuleTemplateV1({
        rule_template_name: urlParams.templateName,
        project_name: projectName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const template = res.data.data;
          setRuleTemplate(template);
          setActiveRule(template?.rule_list ?? []);
        }
      });
  }, [projectName, urlParams.templateName]);

  return (
    <>
      <Card
        title={t('ruleTemplate.updateRuleTemplate.title')}
        extra={[
          <Link to={`/project/${projectName}/rule/template`} key="back">
            <Button type="primary">{t('common.back')}</Button>
          </Link>,
        ]}
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
        >
          <Result
            status="success"
            title={t('ruleTemplate.updateRuleTemplate.successTitle')}
          />
          <Row justify="center">
            <Link to={`/project/${projectName}/rule/template`}>
              <Button type="primary">{t('ruleTemplate.backToList')}</Button>
            </Link>
          </Row>
        </RuleTemplateForm>
      </Card>
    </>
  );
};

export default UpdateRuleTemplate;
