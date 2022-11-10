import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import { useTranslation } from 'react-i18next';
import { ModalFormLayout } from '../../../data/common';
import { nameRule } from '../../../utils/FormRule';
import { MemberGroupFormProps } from './index.type';
import RoleSelector from '../Common/RoleSelector';

const MemberGroupForm: React.FC<MemberGroupFormProps> = ({
  form,
  isUpdate,
}) => {
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
    if (isUpdate) {
      return baseRules;
    }
    return [...baseRules, ...nameRule()];
  };

  return (
    <Form form={form} {...ModalFormLayout}>
      <Form.Item
        name="userGroupName"
        label={t('member.memberGroupForm.userGroupName')}
        validateFirst={true}
        rules={userNameRules()}
      >
        <Input
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('member.memberGroupForm.userGroupName'),
          })}
        />
      </Form.Item>

      <RoleSelector />
    </Form>
  );
};

export default MemberGroupForm;
