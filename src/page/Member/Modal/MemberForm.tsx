import { Form, Input, Switch } from 'antd';
import { Rule } from 'antd/lib/form';
import { useTranslation } from 'react-i18next';
import { ModalFormLayout } from '../../../data/common';
import { nameRule } from '../../../utils/FormRule';
import { MemberFormProps } from './index.type';
import RoleSelector from '../Common/RoleSelector';

const MemberForm: React.FC<MemberFormProps> = ({
  form,
  isUpdate,
  projectName,
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
        name="username"
        label={t('member.memberForm.username')}
        validateFirst={true}
        rules={userNameRules()}
      >
        <Input
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('member.memberForm.username'),
          })}
        />
      </Form.Item>

      <Form.Item
        name="isOwner"
        label={t('member.memberForm.projectAdmin')}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <RoleSelector projectName={projectName} />
    </Form>
  );
};

export default MemberForm;
