import React from 'react';
import { Button, message, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateUserManageModalStatus } from '../../../../../store/userManage';
import { ResponseCode } from '../../../../../data/common';
import { useBoolean } from 'ahooks';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import user from '../../../../../api/user';
import UserForm from '../UserForm';
import { IUserFormFields } from '../UserForm/index.type';
import useUserGroup from '../../../../../hooks/useUserGroup';
import useManagerPermission from '../../../../../hooks/useManagerPermission';

const AddUser = () => {
  const [form] = useForm<IUserFormFields>();
  const { userGroupList, updateUserGroupList } = useUserGroup();
  const { managerPermissionList, updateManagerPermission } =
    useManagerPermission();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [createLoading, { setTrue, setFalse }] = useBoolean();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userManage.modalStatus[ModalName.Add_User]
  );

  const close = React.useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Add_User,
        status: false,
      })
    );
  }, [dispatch, form]);

  const addUser = React.useCallback(async () => {
    const values = await form.validateFields();
    setTrue();
    user
      .createUserV1({
        user_name: values.username,
        user_password: values.password,
        email: values.email,
        user_group_name_list: values.userGroupList,
        wechat_id: values.wechat,
        management_permission_code_list: values.managementPermissionCodeList,
        phone: values.phone ?? '',
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          close();
          message.success(
            t('user.createUser.createSuccessTips', { name: values.username })
          );
          EventEmitter.emit(EmitterKey.Refresh_User_list);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [close, form, setFalse, setTrue, t]);

  React.useEffect(() => {
    if (visible) {
      updateUserGroupList();
      updateManagerPermission();
    }
  }, [updateManagerPermission, updateUserGroupList, visible]);

  return (
    <Modal
      title={t('user.createUser.modalTitle')}
      open={visible}
      closable={false}
      footer={
        <>
          <Button onClick={close} disabled={createLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={addUser} loading={createLoading}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <UserForm
        form={form}
        userGroupList={userGroupList}
        managementPermissionList={managerPermissionList}
      />
    </Modal>
  );
};

export default AddUser;
