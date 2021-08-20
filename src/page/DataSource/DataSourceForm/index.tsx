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
import { ruleTemplateListDefaultKey } from '../../../data/common';

const DataSourceForm: React.FC<IDataSourceFormProps> = (props) => {
  const { t } = useTranslation();
  const isUpdate = React.useMemo<boolean>(
    () => !!props.defaultData,
    [props.defaultData]
  );
  const [databaseType, setDatabaseType] = React.useState<string>(
    ruleTemplateListDefaultKey
  );
  const { updateRoleList, generateRoleSelectOption } = useRole();
  const { updateRuleTemplateList, generateRuleTemplateSelectOption } =
    useRuleTemplate();

  const { updateWorkflowTemplate, generateWorkflowSelectOptions } =
    useWorkflowTemplate();

  const databaseTypeChange = useCallback(
    (value) => {
      setDatabaseType(value ?? ruleTemplateListDefaultKey);
      props.form.setFields([
        {
          name: 'ruleTemplate',
          value: null,
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

  React.useEffect(() => {
    if (!!props.defaultData) {
      props.form.setFieldsValue({
        name: props.defaultData.instance_name,
        describe: props.defaultData.desc,
        type: props.defaultData.db_type,
        ip: props.defaultData.db_host,
        port: Number.parseInt(props.defaultData.db_port ?? ''),
        user: props.defaultData.db_user,
        role: props.defaultData.role_name_list,
        ruleTemplate: Array.isArray(props.defaultData.rule_template_name_list)
          ? props.defaultData.rule_template_name_list[0]
          : '',
        workflow: props.defaultData.workflow_template_name,
      });
      setDatabaseType(props.defaultData.db_type ?? ruleTemplateListDefaultKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultData]);

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
          disabled={isUpdate}
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
        isUpdate={isUpdate}
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
