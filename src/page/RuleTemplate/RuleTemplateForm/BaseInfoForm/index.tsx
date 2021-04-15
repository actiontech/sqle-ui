import { Button, Form, Input, Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageFormLayout } from '../../../../data/common';
import useInstance from '../../../../hooks/useInstance';
import { nameRule } from '../../../../utils/FormRule';
import { RuleTemplateBaseInfoFormProps } from './index.type';

const BaseInfoForm: React.FC<RuleTemplateBaseInfoFormProps> = (props) => {
  const { t } = useTranslation();
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();

  const reset = React.useCallback(() => {
    if (props.isUpdate) {
      props.form.resetFields(['templateDesc', 'instances']);
      return;
    }
    props.form.resetFields();
  }, [props.form, props.isUpdate]);

  React.useEffect(() => {
    updateInstanceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...PageFormLayout} form={props.form}>
      <Form.Item
        label={t('ruleTemplate.ruleTemplateForm.templateName')}
        name="templateName"
        validateFirst={true}
        rules={[
          {
            required: true,
          },
          ...nameRule(),
        ]}
      >
        <Input
          disabled={props.isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('ruleTemplate.ruleTemplateForm.templateName'),
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('ruleTemplate.ruleTemplateForm.templateDesc')}
        name="templateDesc"
      >
        <Input.TextArea
          className="textarea-no-resize"
          placeholder={t('common.form.placeholder.input', {
            name: t('ruleTemplate.ruleTemplateForm.templateDesc'),
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('ruleTemplate.ruleTemplateForm.instances')}
        name="instances"
      >
        <Select
          mode="multiple"
          allowClear
          showSearch
          placeholder={t('common.form.placeholder.select', {
            name: t('ruleTemplate.ruleTemplateForm.instances'),
          })}
        >
          {generateInstanceSelectOption()}
        </Select>
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Space>
          <Button onClick={reset}>{t('common.reset')}</Button>
          <Button type="primary" onClick={props.submit}>
            {t('common.nextStep')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default BaseInfoForm;
