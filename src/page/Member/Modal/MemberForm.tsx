import { Form, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalFormLayout } from '../../../data/common';
import { MemberFormProps } from './index.type';
import RoleSelector from '../Common/RoleSelector';
import useUsername from '../../../hooks/useUsername';
import { useEffect } from 'react';
import EmptyBox from '../../../components/EmptyBox';

const MemberForm: React.FC<MemberFormProps> = ({
  form,
  isUpdate,
  projectName,
  isManager,
  changeIsManager,
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
          showSearch={true}
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
        initialValue={!!isManager}
      >
        <Switch
          checked={isManager}
          onChange={(v) => {
            changeIsManager?.(v);
          }}
        />
      </Form.Item>

      <EmptyBox if={!isManager}>
        <RoleSelector projectName={projectName} />
      </EmptyBox>
    </Form>
  );
};

export default MemberForm;
