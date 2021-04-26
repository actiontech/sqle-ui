import { Form, Input, Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageFormLayout } from '../../../data/common';
import useRole from '../../../hooks/useRole';
import useRuleTemplate from '../../../hooks/useRuleTemplate';
import { nameRule } from '../../../utils/FormRule';
import DatabaseFormItem from './DatabaseFormItem';
import { IDataSourceFormProps } from './index.type';

const DataSourceForm: React.FC<IDataSourceFormProps> = (props) => {
  const { t } = useTranslation();

  const { updateRoleList, generateRoleSelectOption } = useRole();
  const {
    updateRuleTemplateList,
    generateRuleTemplateSelectOption,
  } = useRuleTemplate();

  React.useEffect(() => {
    updateRoleList();
    updateRuleTemplateList();
  }, [updateRoleList, updateRuleTemplateList]);

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
      <DatabaseFormItem isUpdate={props.isUpdate} form={props.form} />
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
          {generateRuleTemplateSelectOption()}
        </Select>
      </Form.Item>
      {/* <Form.Item
        label={t('dataSource.dataSourceForm.workflow')}
        name="workflow"
      >
        <Select
          allowClear
          placeholder={t('common.form.placeholder.select', {
            name: t('dataSource.dataSourceForm.workflow'),
          })}
        >
          <Select.Option value={1}>1</Select.Option>
        </Select>
      </Form.Item> */}
    </Form>
  );
};

export default DataSourceForm;
