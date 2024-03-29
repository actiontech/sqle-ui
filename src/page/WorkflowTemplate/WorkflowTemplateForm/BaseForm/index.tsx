import { Button, Form, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '../../../../api/common.enum';
import { PageFormLayout } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { BaseFormFields, BaseFormProps } from './index.type';
import useStaticStatus from '../../../../hooks/useStaticStatus';
import FooterButtonWrapper from '../../../../components/FooterButtonWrapper';

const BaseForm: React.FC<BaseFormProps> = (props) => {
  const { t } = useTranslation();
  const [form] = useForm<BaseFormFields>();
  const { getAuditLevelStatusSelectOption } = useStaticStatus();

  const nextStep = async () => {
    const value = await form.validateFields();
    props.updateBaseInfo(value);
    props.nextStep();
  };

  const resetForm = () => {
    if (!!props.defaultData) {
      form.resetFields([
        'desc',
        'allowSubmitWhenLessAuditLevel',
        'instanceNameList',
      ]);
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    const resetAllForm = () => {
      form.resetFields();
    };
    EventEmitter.subscribe(
      EmitterKey.Reset_Workflow_Template_Form,
      resetAllForm
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Workflow_Template_Form,
        resetAllForm
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!props.defaultData) {
      form.setFieldsValue({
        allowSubmitWhenLessAuditLevel: props.defaultData
          .allow_submit_when_less_audit_level as
          | WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
          | undefined,
      });
    } else {
      form.setFieldsValue({
        allowSubmitWhenLessAuditLevel:
          WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
      });
    }
  }, [form, props.defaultData]);

  return (
    <Form {...PageFormLayout} form={form}>
      <Form.Item
        label={t('workflowTemplate.form.label.allowSubmitWhenLessAuditLevel')}
        name="allowSubmitWhenLessAuditLevel"
      >
        <Select
          placeholder={t('common.form.placeholder.select', {
            name: t(
              'workflowTemplate.form.label.allowSubmitWhenLessAuditLevel'
            ),
          })}
        >
          {getAuditLevelStatusSelectOption()}
        </Select>
      </Form.Item>
      <FooterButtonWrapper>
        <Button onClick={resetForm}>{t('common.reset')}</Button>
        <Button onClick={nextStep} type="primary">
          {t('common.nextStep')}
        </Button>
      </FooterButtonWrapper>
    </Form>
  );
};

export default BaseForm;
