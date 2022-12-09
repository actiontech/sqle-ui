import { Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalFormLayout } from '../../../data/common';
import { MemberGroupFormProps } from './index.type';
import RoleSelector from '../Common/RoleSelector';
import useUserGroup from '../../../hooks/useUserGroup';
import { useEffect } from 'react';

const MemberGroupForm: React.FC<MemberGroupFormProps> = ({
  form,
  isUpdate,
  projectName,
}) => {
  const { t } = useTranslation();

  const { updateUserGroupList, generateUserGroupSelectOption } = useUserGroup();

  useEffect(() => {
    updateUserGroupList();
  }, [updateUserGroupList]);

  return (
    <Form form={form} {...ModalFormLayout}>
      <Form.Item
        name="userGroupName"
        label={t('member.memberGroupForm.userGroupName')}
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
          showSearch={true}
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.select', {
            name: t('member.memberGroupForm.userGroupName'),
          })}
        >
          {generateUserGroupSelectOption({ showTooltip: true })}
        </Select>
      </Form.Item>

      <RoleSelector projectName={projectName} />
    </Form>
  );
};

export default MemberGroupForm;
