import { IUserFormProps } from './index.type';
import { Form, Input, Select, Switch } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalFormLayout } from '../../../../../data/common';
import EmptyBox from '../../../../../components/EmptyBox';
import { nameRule } from '../../../../../utils/FormRule';
import { Rule } from 'antd/lib/form';

const UserForm: React.FC<IUserFormProps> = (props) => {
  const { t } = useTranslation();

  const userNameRules = (): Rule[] => {
    const baseRules = [
      {
        required: true,
        message: t('common.form.rule.require', {
          name: t('user.userForm.username'),
        }),
      },
    ];
    if (props.isUpdate) {
      return baseRules;
    }
    return [...baseRules, ...nameRule()];
  };

  return (
    <Form form={props.form} {...ModalFormLayout}>
      <Form.Item
        name="username"
        label={t('user.userForm.username')}
        validateFirst={true}
        rules={userNameRules()}
      >
        <Input
          disabled={props.isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('user.userForm.username'),
          })}
        />
      </Form.Item>
      <EmptyBox if={!props.isUpdate}>
        <Form.Item
          name="password"
          label={t('user.userForm.password')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('user.userForm.password'),
              }),
            },
          ]}
        >
          <Input.Password
            placeholder={t('common.form.placeholder.input', {
              name: t('user.userForm.password'),
            })}
          />
        </Form.Item>
        <Form.Item
          name="passwordConfirm"
          label={t('user.userForm.passwordConfirm')}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('user.userForm.passwordConfirm'),
              }),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t('common.form.rule.passwordNotMatch'))
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={t('user.userForm.passwordConfirmPlaceholder')}
          />
        </Form.Item>
      </EmptyBox>
      <Form.Item
        name="email"
        label={t('user.userForm.email')}
        rules={[
          {
            type: 'email',
            message: t('common.form.rule.email'),
          },
        ]}
      >
        <Input
          placeholder={t('common.form.placeholder.input', {
            name: t('user.userForm.email'),
          })}
        />
      </Form.Item>
      <Form.Item name="wechat" label={t('user.userForm.wechat')}>
        <Input
          placeholder={t('common.form.placeholder.input', {
            name: t('user.userForm.wechat'),
          })}
        />
      </Form.Item>
      <Form.Item name="roleNameList" label={t('user.userForm.role')}>
        <Select
          mode="multiple"
          showSearch
          placeholder={t('common.form.placeholder.select', {
            name: t('user.userForm.role'),
          })}
        >
          {props.roleNameList.map((role) => (
            <Select.Option value={role.role_name ?? ''} key={role.role_name}>
              {role.role_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="userGroupList" label={t('user.userForm.userGroup')}>
        <Select
          mode="multiple"
          showSearch
          placeholder={t('common.form.placeholder.select')}
        >
          {props.userGroupList.map((group) => (
            <Select.Option
              key={group.user_group_name}
              value={group.user_group_name ?? ''}
            >
              {group.user_group_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <EmptyBox if={props.isUpdate && !props.isAdmin}>
        <Form.Item
          name="disabled"
          label={t('user.userForm.disabled')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </EmptyBox>
    </Form>
  );
};

export default UserForm;
