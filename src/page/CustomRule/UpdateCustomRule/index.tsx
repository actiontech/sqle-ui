import { Button, Card, Form, Result, Row, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import BackButton from '../../../components/BackButton';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import ruleTemplate from '../../../api/rule_template';
import CustomRuleForm from '../CustomRuleForm/CustomRuleForm';
import {
  CustomRuleFormBaseInfoFields,
  EditRuleScriptFields,
} from '../CustomRuleForm';
import { useCallback, useState } from 'react';
import { Link } from '../../../components/Link';
import { ResponseCode } from '../../../data/common';
import { UpdateCustomRuleReqV1LevelEnum } from '../../../api/common.enum';

const UpdateCustomRule: React.FC = () => {
  const { t } = useTranslation();
  const { ruleID = '' } = useParams<{ ruleID: string }>();
  const [form] = Form.useForm<CustomRuleFormBaseInfoFields>();
  const [editScriptForm] = Form.useForm<EditRuleScriptFields>();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data, loading: getCustomRuleLoading } = useRequest(
    () =>
      ruleTemplate
        .getCustomRuleV1({ rule_id: ruleID })
        .then((res) => res.data.data),
    {
      ready: !!ruleID,
    }
  );

  const baseInfoFormSubmit = useCallback(async () => {
    await form.validateFields();

    setStep(step + 1);
  }, [form, step]);

  const prevStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const submit = useCallback(async () => {
    const baseInfo = await form.validateFields();
    const values = await editScriptForm.validateFields();

    setLoading(true);

    ruleTemplate
      .updateCustomRuleV1({
        rule_id: ruleID,
        desc: baseInfo.desc,
        level: baseInfo.level as UpdateCustomRuleReqV1LevelEnum | undefined,
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
        setLoading(false);
      });
  }, [editScriptForm, form, ruleID]);

  return (
    <Card
      title={t('customRule.editCustomRule.title')}
      extra={[<BackButton key="back" />]}
      bordered={false}
    >
      <Spin spinning={getCustomRuleLoading} delay={800}>
        <CustomRuleForm
          form={form}
          editScriptForm={editScriptForm}
          step={step}
          prevStep={prevStep}
          defaultData={data}
          submit={submit}
          submitLoading={loading}
          baseInfoSubmit={baseInfoFormSubmit}
        >
          <Result
            status="success"
            title={t('customRule.editCustomRule.successTitle')}
            style={{ paddingBottom: 10 }}
          />
          <Row justify="center">
            <Button type="primary">
              <Link to="rule/custom">
                {t('customRule.editCustomRule.backToList')}
              </Link>
            </Button>
          </Row>
        </CustomRuleForm>
      </Spin>
    </Card>
  );
};

export default UpdateCustomRule;
