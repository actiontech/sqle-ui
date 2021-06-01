import { Form, Input, Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalFormLayout } from '../../../../data/common';
import { nameRule } from '../../../../utils/FormRule';
import { IRoleFormProps } from './index.type';

const RoleForm: React.FC<IRoleFormProps> = (props) => {
  const { t } = useTranslation();

  return (
    <Form form={props.form} {...ModalFormLayout}>
      <Form.Item
        name="roleName"
        label={t('user.roleForm.roleName')}
        validateFirst={true}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('user.roleForm.roleName'),
            }),
          },
          ...nameRule(),
        ]}
      >
        <Input
          disabled={props.isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('user.roleForm.roleName'),
          })}
        />
      </Form.Item>
      <Form.Item name="roleDesc" label={t('user.roleForm.roleDesc')}>
        <Input.TextArea
          style={{ resize: 'none' }}
          rows={3}
          placeholder={t('common.form.placeholder.input', {
            name: t('user.roleForm.roleDesc'),
          })}
        />
      </Form.Item>
      <Form.Item name="databases" label={t('user.roleForm.databases')}>
        <Select
          mode="multiple"
          showSearch
          placeholder={t('common.form.placeholder.select', {
            name: t('user.roleForm.databases'),
          })}
        >
          {props.instanceList.map((instance) => (
            <Select.Option
              value={instance.instance_name ?? ''}
              key={instance.instance_name}
            >
              {instance.instance_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="usernames" label={t('user.roleForm.usernames')}>
        <Select
          mode="multiple"
          showSearch
          placeholder={t('common.form.placeholder.select')}
        >
          {props.usernameList.map((user) => (
            <Select.Option value={user.user_name ?? ''} key={user.user_name}>
              {user.user_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
