import { Button, Form, Input, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '../../../../api/common.enum';
import { PageFormLayout } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import useInstance from '../../../../hooks/useInstance';
import EventEmitter from '../../../../utils/EventEmitter';
import { nameRule } from '../../../../utils/FormRule';
import { BaseFormFields, BaseFormProps } from './index.type';
import useStaticStatus from '../../../../hooks/useStaticStatus';
import { useCurrentProjectName } from '../../../ProjectManage/ProjectDetail';

const BaseForm: React.FC<BaseFormProps> = (props) => {
  const { t } = useTranslation();
  const [form] = useForm<BaseFormFields>();
  const { getAuditLevelStatusSelectOption } = useStaticStatus();

  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { projectName } = useCurrentProjectName();
  useEffect(() => {
    updateInstanceList({ project_name: projectName });
  }, [projectName, updateInstanceList]);

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
        name: props.defaultData.workflow_template_name,
        desc: props.defaultData.desc,
        allowSubmitWhenLessAuditLevel: props.defaultData
          .allow_submit_when_less_audit_level as
          | CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum
          | undefined,
        instanceNameList: props.defaultData.instance_name_list,
      });
    } else {
      form.setFieldsValue({
        allowSubmitWhenLessAuditLevel:
          CreateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn,
      });
    }
  }, [form, props.defaultData]);

  return (
    <Form {...PageFormLayout} form={form}>
      <Form.Item
        label={t('workflowTemplate.form.label.name')}
        name="name"
        validateFirst={true}
        rules={[
          {
            required: true,
          },
          ...nameRule(),
        ]}
      >
        <Input
          disabled={!!props.defaultData}
          placeholder={t('common.form.placeholder.input', {
            name: t('workflowTemplate.form.label.name'),
          })}
        />
      </Form.Item>
      <Form.Item label={t('workflowTemplate.form.label.desc')} name="desc">
        <Input.TextArea
          placeholder={t('common.form.placeholder.input', {
            name: t('workflowTemplate.form.label.desc'),
          })}
          rows={3}
          className="textarea-no-resize"
        />
      </Form.Item>
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
      <Form.Item
        label={t('workflowTemplate.form.label.instanceNameList')}
        name="instanceNameList"
      >
        <Select
          showSearch
          placeholder={t('common.form.placeholder.select', {
            name: t('workflowTemplate.form.label.instanceNameList'),
          })}
          mode="multiple"
        >
          {generateInstanceSelectOption()}
        </Select>
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Space>
          <Button onClick={resetForm}>{t('common.reset')}</Button>
          <Button onClick={nextStep} type="primary">
            {t('common.nextStep')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default BaseForm;
