import { Button, Form, Input, Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  instanceListDefaultKey,
  PageFormLayout,
} from '../../../../data/common';
import { nameRule } from '../../../../utils/FormRule';
import { RuleTemplateBaseInfoFormProps } from './index.type';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import { Rule } from 'antd/lib/form';
import useInstance from '../../../../hooks/useInstance';
import { useCurrentProjectName } from '../../../ProjectManage/ProjectDetail';

const BaseInfoForm: React.FC<RuleTemplateBaseInfoFormProps> = (props) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProjectName();
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();
  const [databaseType, setDatabaseType] = React.useState<string>(
    props.form.getFieldValue('db_type') ?? instanceListDefaultKey
  );

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

  const databaseTypeChange = React.useCallback(
    (value) => {
      setDatabaseType(value ?? instanceListDefaultKey);
      props.form.setFields([
        {
          name: 'instances',
          value: [],
        },
      ]);
    },
    [props.form]
  );

  const nameFormRule: () => Rule[] = React.useCallback(() => {
    const rule: Rule[] = [
      {
        required: true,
      },
    ];

    if (!isUpdate) {
      rule.push(...nameRule());
    }
    return rule;
  }, [isUpdate]);

  React.useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateDriverNameList();
  }, [projectName, updateDriverNameList, updateInstanceList]);

  React.useEffect(() => {
    if (!!props.defaultData) {
      setDatabaseType(props.defaultData.db_type ?? instanceListDefaultKey);
      props.form.setFieldsValue({
        templateName: props.defaultData.rule_template_name,
        templateDesc: props.defaultData.desc,
        db_type: props.defaultData.db_type,
        instances:
          props.defaultData.instance_list?.map((v) => v.name ?? '') ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultData]);

  return (
    <Form {...PageFormLayout} form={props.form}>
      <Form.Item
        label={t('ruleTemplate.ruleTemplateForm.templateName')}
        name="templateName"
        validateFirst={true}
        rules={nameFormRule()}
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
          onChange={databaseTypeChange}
          disabled={isUpdate}
        >
          {generateDriverSelectOptions()}
        </Select>
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
          {generateInstanceSelectOption(databaseType)}
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
