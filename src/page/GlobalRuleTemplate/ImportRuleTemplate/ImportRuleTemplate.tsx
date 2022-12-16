import { useBoolean } from 'ahooks';
import {
  Button,
  Card,
  Upload,
  Form,
  Result,
  Typography,
  Row,
  message,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SelectFileFormFields } from '.';
import { IRuleReqV1, IRuleResV1 } from '../../../api/common';
import rule_template from '../../../api/rule_template';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import { getFileFromUploadChangeEvent } from '../../../utils/Common';
import RuleTemplateForm from '../RuleTemplateForm';
import { RuleTemplateBaseInfoFields } from '../RuleTemplateForm/BaseInfoForm/index.type';
import { RuleTemplateFormProps } from '../RuleTemplateForm/index.type';

const ImportRuleTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [selectFileForm] = useForm<SelectFileFormFields>();
  const [ruleTemplateForm] = useForm<RuleTemplateBaseInfoFields>();

  const [ruleTemplateFormVisibility, setRuleTemplateFormVisibility] =
    useState(false);

  const [activeRule, setActiveRule] = useState<
    RuleTemplateFormProps['activeRule']
  >([]);
  const [allRules, setAllRules] = useState<RuleTemplateFormProps['allRules']>(
    []
  );

  const [createLoading, { toggle: updateCreateLoading }] = useBoolean();
  const [getAllRulesLoading, { toggle: updateGetAllRulesLoading }] =
    useBoolean();

  const [step, setStep] = useState(0);

  const getAllRulesByDbTypeAndFilterActiveRuleList = (
    importRuleList: IRuleResV1[],
    dbType?: string
  ) => {
    updateGetAllRulesLoading(true);

    rule_template
      .getRuleListV1({
        filter_db_type: dbType,
      })
      .then((res) => {
        if (ResponseCode.SUCCESS === res.data.code) {
          setAllRules(res.data.data ?? []);
          setActiveRule(
            importRuleList.filter((rule) => {
              return res.data.data?.some(
                (allRule) => allRule.rule_name === rule.rule_name
              );
            })
          );
        }
      })
      .finally(() => {
        updateGetAllRulesLoading(false);
      });
  };

  const importFile = (values: SelectFileFormFields) => {
    const hideLoading = message.loading(
      t('ruleTemplate.importRuleTemplate.importingFile'),
      0
    );
    rule_template
      .importProjectRuleTemplateV1({
        rule_template_file: values.ruleTemplateFile[0],
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const parseFileData = res.data.data;
          if (parseFileData) {
            setRuleTemplateFormVisibility(true);
            getAllRulesByDbTypeAndFilterActiveRuleList(
              parseFileData.rule_list ?? [],
              parseFileData.db_type
            );
            ruleTemplateForm.setFieldsValue({
              templateDesc: parseFileData.desc,
              templateName: parseFileData.name,
              db_type: parseFileData.db_type,
            });
          }
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  const baseInfoFormSubmit = useCallback(async () => {
    setStep(step + 1);
  }, [step]);

  const prevStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const submit = useCallback(() => {
    updateCreateLoading(true);
    const baseInfo = ruleTemplateForm.getFieldsValue();
    const activeRuleWithNewField: IRuleReqV1[] = activeRule.map((rule) => {
      return {
        name: rule.rule_name,
        level: rule.level,
        params: !!rule.params
          ? rule.params.map((v) => ({ key: v.key, value: v.value }))
          : [],
      };
    });
    rule_template
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
  }, [activeRule, ruleTemplateForm, step, updateCreateLoading]);

  const resetAll = useCallback(() => {
    setStep(0);
    ruleTemplateForm.resetFields();
    selectFileForm.resetFields();
    setActiveRule([]);
    setRuleTemplateFormVisibility(false);
  }, [ruleTemplateForm, selectFileForm]);

  return (
    <Card
      title={t('ruleTemplate.importRuleTemplate.title')}
      extra={[<BackButton key="goBack" />]}
    >
      <EmptyBox
        if={ruleTemplateFormVisibility}
        defaultNode={
          <Form<SelectFileFormFields>
            form={selectFileForm}
            onFinish={importFile}
          >
            <Form.Item
              label={t('ruleTemplate.importRuleTemplate.selectFile')}
              name="ruleTemplateFile"
              valuePropName="fileList"
              getValueFromEvent={getFileFromUploadChangeEvent}
              rules={[
                {
                  required: true,
                  message: t('ruleTemplate.importRuleTemplate.fileRequireTips'),
                },
              ]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                onRemove={() => {
                  selectFileForm.setFieldsValue({
                    ruleTemplateFile: [],
                  });
                }}
              >
                <Button>{t('common.upload')}</Button>
              </Upload>
            </Form.Item>

            <Form.Item label=" " colon={false}>
              <Button htmlType="submit" type="primary">
                {t('ruleTemplate.importRuleTemplate.submitText')}
              </Button>
            </Form.Item>
          </Form>
        }
      >
        <RuleTemplateForm
          form={ruleTemplateForm}
          activeRule={activeRule}
          allRules={allRules ?? []}
          ruleListLoading={getAllRulesLoading}
          submitLoading={createLoading}
          step={step}
          updateActiveRule={setActiveRule}
          baseInfoSubmit={baseInfoFormSubmit}
          prevStep={prevStep}
          submit={submit}
          mode="import"
        >
          <Result
            status="success"
            title={t('ruleTemplate.importRuleTemplate.successTitle')}
            subTitle={
              <Typography.Link
                type="secondary"
                className="pointer"
                onClick={resetAll}
              >
                {t('ruleTemplate.importRuleTemplate.importNew')}
              </Typography.Link>
            }
          />
          <Row justify="center">
            <Link to="/rule/template">
              <Button type="primary">{t('ruleTemplate.backToList')}</Button>
            </Link>
          </Row>
        </RuleTemplateForm>
      </EmptyBox>
    </Card>
  );
};

export default ImportRuleTemplate;
