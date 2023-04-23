import { useBoolean } from 'ahooks';
import { Button, Form, Input, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import { useTranslation } from 'react-i18next';
import user from '../../../../api/user';
import { ModalFormLayout, ResponseCode } from '../../../../data/common';
import { ModalName } from '../../../../data/ModalName';
import useNavigate from '../../../../hooks/useNavigate';
import useUserInfo from '../../../../hooks/useUserInfo';
import { ModifyPasswordFormFields, ModifyPasswordProps } from './index.type';

const ModifyPasswordModal: React.FC<ModifyPasswordProps> = (props) => {
  const { t } = useTranslation();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const navigate = useNavigate();
  const [form] = useForm<ModifyPasswordFormFields>();
  const { clearUserInfo } = useUserInfo();

  const submit = (value: ModifyPasswordFormFields) => {
    startSubmit();
    user
      .UpdateCurrentUserPasswordV1({
        password: value.password,
        new_password: value.newPassword,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          clearUserInfo();
          navigate('/login', { replace: true });
        } else {
          submitFinish();
        }
      })
      .catch(() => {
        submitFinish();
      });
  };

  const close = () => {
    form.resetFields();
    props.setModalStatus(ModalName.Modify_Password, false);
  };

  return (
    <Modal
      open={props.visible}
      title={t('account.modifyPassword.title')}
      footer={null}
      onCancel={close}
    >
      <Form {...ModalFormLayout} onFinish={submit} form={form}>
        <Form.Item
          name="password"
          label={t('account.modifyPassword.oldPassword')}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password
            placeholder={t('common.form.placeholder.input', {
              name: t('account.modifyPassword.oldPassword'),
            })}
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={t('account.modifyPassword.newPassword')}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password
            placeholder={t('common.form.placeholder.input', {
              name: t('account.modifyPassword.newPassword'),
            })}
          />
        </Form.Item>
        <Form.Item
          name="newPasswordConfirm"
          label={t('account.modifyPassword.newPasswordConfirm')}
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
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
        <Form.Item label=" " colon={false}>
          <Space>
            <Button disabled={submitLoading} onClick={close}>
              {t('common.cancel')}
            </Button>
            <Button loading={submitLoading} type="primary" htmlType="submit">
              {t('common.submit')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModifyPasswordModal;
