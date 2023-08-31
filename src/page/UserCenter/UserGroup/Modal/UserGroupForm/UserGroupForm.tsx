import { Form, Input, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserGroupFormProps } from '.';
import EmptyBox from '../../../../../components/EmptyBox';
import IconTipsLabel from '../../../../../components/IconTipsLabel';
import { ModalFormLayout } from '../../../../../data/common';
import { nameRule } from '../../../../../utils/FormRule';

const UserGroupForm: React.FC<UserGroupFormProps> = (props) => {
  const { form, userList, isUpdate } = props;
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
          ...nameRule(119),
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
          label={
            <IconTipsLabel tips={t('userGroup.userGroupField.isDisabledTips')}>
              {t('userGroup.userGroupField.isDisabled')}
            </IconTipsLabel>
          }
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
      </EmptyBox>
      <Form.Item
        name="userList"
        label={t('userGroup.userGroupField.userNameList')}
      >
        <Select
          showSearch
          mode="multiple"
          placeholder={t('common.form.placeholder.select')}
        >
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
