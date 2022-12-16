import { Button, Form, Input, Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageFormLayout } from '../../../../data/common';
import { nameRule } from '../../../../utils/FormRule';
import { RuleTemplateBaseInfoFormProps } from './index.type';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import { Rule } from 'antd/lib/form';

const BaseInfoForm: React.FC<RuleTemplateBaseInfoFormProps> = (props) => {
  const { t } = useTranslation();
  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();

  const isUpdate = React.useMemo(
    () => !!props.defaultData,
    [props.defaultData]
  );

  const reset = React.useCallback(() => {
    if (isUpdate) {
      props.form.resetFields(['templateDesc', 'instances']);
      return;
    }
    props.form.resetFields();
  }, [props.form, isUpdate]);

  React.useEffect(() => {
    updateDriverNameList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!!props.defaultData) {
      props.form.setFieldsValue({
        templateName: props.defaultData.rule_template_name,
        templateDesc: props.defaultData.desc,
        db_type: props.defaultData.db_type,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultData]);

  const nameFormRule: Rule[] = [
    {
      required: true,
    },
  ];

  if (!isUpdate) {
    nameFormRule.push(...nameRule());
  }

  return (
    <Form {...PageFormLayout} form={props.form}>
      <Form.Item
        label={t('ruleTemplate.ruleTemplateForm.templateName')}
        name="templateName"
        validateFirst={true}
        rules={nameFormRule}
      >
        <Input
          disabled={isUpdate}
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
        label={t('ruleTemplate.ruleTemplateForm.databaseType')}
        name="db_type"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={t('common.form.placeholder.select', {
            name: t('ruleTemplate.ruleTemplateForm.databaseType'),
          })}
          allowClear
          disabled={isUpdate || props.mode === 'import'}
        >
          {generateDriverSelectOptions()}
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
