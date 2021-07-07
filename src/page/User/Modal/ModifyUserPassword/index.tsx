import { useBoolean } from 'ahooks';
import { Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IUserResV1 } from '../../../../api/common';
import user from '../../../../api/user';
import { ModalFormLayout, ResponseCode } from '../../../../data/common';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import { updateUserManageModalStatus } from '../../../../store/userManage';

const ModifyUserPassword = () => {
  const visible = useSelector<IReduxState, boolean>(
    (state) => state.userManage.modalStatus[ModalName.Update_User_Password]
  );
  const selectUser = useSelector<IReduxState, IUserResV1 | null>(
    (state) => state.userManage.selectUser
  );
  const [form] = useForm<{ password: string; passwordConfirm: string }>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const close = () => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Update_User_Password,
        status: false,
      })
    );
  };
  const submit = async () => {
    const value = await form.validateFields();
    startSubmit();
    user
      .UpdateOtherUserPasswordV1({
        user_name: selectUser?.user_name ?? '',
        password: value.password,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('user.updateUserPassword.successTips'));
          close();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  return (
    <Modal
      visible={visible}
      title={t('user.updateUserPassword.title', {
        name: selectUser?.user_name,
      })}
      closable={false}
      footer={
        <>
          <Button onClick={close} disabled={submitLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={submit} loading={submitLoading}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <Form {...ModalFormLayout} form={form}>
        <Form.Item
          name="password"
          label={t('user.userForm.password')}
          rules={[
            {
              required: true,
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
      </Form>
    </Modal>
  );
};

export default ModifyUserPassword;
