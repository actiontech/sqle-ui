import { Form, Input, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserGroupFormProps } from '.';
import EmptyBox from '../../../../../components/EmptyBox';
import { ModalFormLayout } from '../../../../../data/common';

const UserGroupForm: React.FC<UserGroupFormProps> = (props) => {
  const { form, roleList, userList, isUpdate } = props;
  const { t } = useTranslation();

  return (
    <Form form={form} {...ModalFormLayout}>
      <Form.Item
        name="userGroupName"
        label={t('userGroup.userGroupField.userGroupName')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.input')}
        />
      </Form.Item>
      <Form.Item
        name="userGroupDesc"
        label={t('userGroup.userGroupField.userGroupDesc')}
      >
        <Input.TextArea placeholder={t('common.form.placeholder.input')} />
      </Form.Item>
      <EmptyBox if={isUpdate}>
        <Form.Item
          name="isDisabled"
          label={t('userGroup.userGroupField.isDisabled')}
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
      </EmptyBox>
      <Form.Item
        name="roleList"
        label={t('userGroup.userGroupField.roleNameList')}
      >
        <Select placeholder={t('common.form.placeholder.select')}>
          {roleList?.map((role) => (
            <Select.Option key={role.role_name} value={role.role_name ?? ''}>
              {role.role_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="userList"
        label={t('userGroup.userGroupField.userNameList')}
      >
        <Select placeholder={t('common.form.placeholder.select')}>
          {userList?.map((user) => (
            <Select.Option key={user.user_name} value={user.user_name ?? ''}>
              {user.user_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default UserGroupForm;
