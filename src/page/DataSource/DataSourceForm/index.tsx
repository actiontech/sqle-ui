import { Form, Input, Select } from 'antd';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PageFormLayout } from '../../../data/common';
import useRole from '../../../hooks/useRole';
import useRuleTemplate from '../../../hooks/useRuleTemplate';
import useWorkflowTemplate from '../../../hooks/useWorkflowTemplate';
import { nameRule } from '../../../utils/FormRule';
import DatabaseFormItem from './DatabaseFormItem';
import { IDataSourceFormProps } from './index.type';

const DataSourceForm: React.FC<IDataSourceFormProps> = (props) => {
  const { t } = useTranslation();
  const [databaseType, setDatabaseType] = React.useState<string>(
    props.form.getFieldValue('type')
  );
  const { updateRoleList, generateRoleSelectOption } = useRole();
  const { updateRuleTemplateList, generateRuleTemplateSelectOption } =
    useRuleTemplate();

  const { updateWorkflowTemplate, generateWorkflowSelectOptions } =
    useWorkflowTemplate();

  const databaseTypeChange = useCallback(
    (value) => {
      setDatabaseType(value ?? '');
      props.form.setFields([
        {
          name: 'ruleTemplate',
          value: [],
        },
      ]);
    },
    [props.form]
  );

  React.useEffect(() => {
    updateRoleList();
    updateRuleTemplateList();
    updateWorkflowTemplate();
  }, [updateRoleList, updateRuleTemplateList, updateWorkflowTemplate]);

  return (
    <Form form={props.form} {...PageFormLayout}>
      <Form.Item
        label={t('dataSource.dataSourceForm.name')}
        name="name"
        validateFirst={true}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dataSource.dataSourceForm.name'),
            }),
          },
          ...nameRule(),
        ]}
      >
        <Input
          disabled={props.isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('dataSource.dataSourceForm.name'),
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.describe')}
        name="describe"
      >
        <Input.TextArea
          placeholder={t('common.form.placeholder.input', {
            name: t('dataSource.dataSourceForm.describe'),
          })}
        />
      </Form.Item>
      <DatabaseFormItem
        isUpdate={props.isUpdate}
        form={props.form}
        databaseTypeChange={databaseTypeChange}
      />
      <Form.Item label={t('dataSource.dataSourceForm.role')} name="role">
        <Select
          mode="multiple"
          allowClear
          placeholder={t('common.form.placeholder.select', {
            name: t('dataSource.dataSourceForm.role'),
          })}
        >
          {generateRoleSelectOption()}
        </Select>
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.ruleTemplate')}
        name="ruleTemplate"
      >
        <Select
          mode="multiple"
          allowClear
          placeholder={t('common.form.placeholder.select', {
            name: t('dataSource.dataSourceForm.ruleTemplate'),
          })}
        >
          {generateRuleTemplateSelectOption(databaseType)}
        </Select>
      </Form.Item>
      <Form.Item
        label={t('dataSource.dataSourceForm.workflow')}
        name="workflow"
      >
        <Select
          allowClear
          placeholder={t('common.form.placeholder.select', {
            name: t('dataSource.dataSourceForm.workflow'),
          })}
        >
          {generateWorkflowSelectOptions()}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default DataSourceForm;
