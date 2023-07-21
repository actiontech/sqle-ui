import { Button, Card, Form, Result, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import BackButton from '../../../components/BackButton';
import CustomRuleForm from '../CustomRuleForm/CustomRuleForm';
import {
  CustomRuleFormBaseInfoFields,
  EditRuleScriptFields,
} from '../CustomRuleForm';
import { useCallback, useState } from 'react';
import ruleTemplate from '../../../api/rule_template';
import { ResponseCode } from '../../../data/common';
import { CreateCustomRuleReqV1LevelEnum } from '../../../api/common.enum';
import { Link } from '../../../components/Link';

const CreateCustomRule: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<CustomRuleFormBaseInfoFields>();
  const [editScriptForm] = Form.useForm<EditRuleScriptFields>();
  const [step, setStep] = useState(0);
  const [createLoading, updateCreateLoading] = useState(false);

  const prevStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const submit = useCallback(async () => {
    updateCreateLoading(true);

    const baseInfo = await form.validateFields();
    const values = await editScriptForm.validateFields();

    ruleTemplate
      .createCustomRuleV1({
        db_type: baseInfo.dbType,
        desc: baseInfo.desc,
        level: baseInfo.level as CreateCustomRuleReqV1LevelEnum | undefined,
        annotation: baseInfo.annotation,
        rule_script: values.script,
        type: baseInfo.ruleType,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setStep((v) => v + 1);
        }
      })
      .finally(() => {
        updateCreateLoading(false);
      });
  }, [editScriptForm, form]);

  const baseInfoFormSubmit = useCallback(async () => {
    await form.validateFields();
    setStep(step + 1);
  }, [form, step]);

  return (
    <Card
      title={t('customRule.addCustomRule.title')}
      extra={[<BackButton key="back" />]}
    >
      <CustomRuleForm
        form={form}
        editScriptForm={editScriptForm}
        step={step}
        prevStep={prevStep}
        submit={submit}
        baseInfoSubmit={baseInfoFormSubmit}
        submitLoading={createLoading}
      >
        <Result
          status="success"
          title={t('customRule.addCustomRule.successTitle')}
          style={{ paddingBottom: 10 }}
        />
        <Row justify="center">
          <Button type="primary">
            <Link to="rule/custom">
              {t('customRule.addCustomRule.backToList')}
            </Link>
          </Button>
        </Row>
        <Row justify="center">
          <Typography.Text>
            {t('customRule.addCustomRule.successTips')}
          </Typography.Text>
        </Row>
      </CustomRuleForm>
    </Card>
  );
};

export default CreateCustomRule;
