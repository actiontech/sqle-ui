import { Form, Input, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalFormLayout } from '../../../data/common';
import { MemberFormProps } from './index.type';
import RoleSelector from '../Common/RoleSelector';
import useUsername from '../../../hooks/useUsername';
import { useEffect } from 'react';

const MemberForm: React.FC<MemberFormProps> = ({
  form,
  isUpdate,
  projectName,
}) => {
  const { t } = useTranslation();
  const { updateUsernameList, generateUsernameSelectOption } = useUsername();

  useEffect(() => {
    updateUsernameList();
  }, [updateUsernameList]);

  return (
    <Form form={form} {...ModalFormLayout}>
      <Form.Item
        name="username"
        label={t('member.memberForm.username')}
        validateFirst={true}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('user.userForm.username'),
            }),
          },
        ]}
      >
        <Select
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.select', {
            name: t('member.memberForm.username'),
          })}
        >
          {generateUsernameSelectOption()}
        </Select>
      </Form.Item>

      <Form.Item
        name="isManager"
        label={t('member.memberForm.projectAdmin')}
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </Form.Item>

      <RoleSelector projectName={projectName} />
    </Form>
  );
};

export default MemberForm;
