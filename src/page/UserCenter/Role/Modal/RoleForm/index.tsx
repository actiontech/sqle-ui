import { Form, Input, Select, Switch } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../../../../../components/EmptyBox';
import { ModalFormLayout } from '../../../../../data/common';
import { nameRule } from '../../../../../utils/FormRule';
import { IRoleFormProps } from './index.type';

const RoleForm: React.FC<IRoleFormProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Form form={props.form} {...ModalFormLayout}>
      <Form.Item
        name="roleName"
        label={t('role.roleForm.roleName')}
        validateFirst={true}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('role.roleForm.roleName'),
            }),
          },
          ...nameRule(),
        ]}
      >
        <Input
          disabled={props.isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('role.roleForm.roleName'),
          })}
        />
      </Form.Item>
      <Form.Item name="roleDesc" label={t('role.roleForm.roleDesc')}>
        <Input.TextArea
          style={{ resize: 'none' }}
          rows={3}
          placeholder={t('common.form.placeholder.input', {
            name: t('role.roleForm.roleDesc'),
          })}
        />
      </Form.Item>
      <EmptyBox if={props.isUpdate}>
        <Form.Item
          name="isDisabled"
          label={t('role.roleForm.isDisabled')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </EmptyBox>
      <Form.Item
        name="operationCodes"
        label={t('role.roleForm.operationCodes')}
      >
        <Select
          mode="multiple"
          showSearch
          placeholder={t('common.form.placeholder.select')}
        >
          {props.operationList.map((operation) => (
            <Select.Option
              key={operation.op_code}
              value={operation.op_code ?? ''}
            >
              {operation.op_desc}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
