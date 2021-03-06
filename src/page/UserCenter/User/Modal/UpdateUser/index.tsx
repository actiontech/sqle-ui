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
import useRole from '../../../../../hooks/useRole';
import { IUserResV1 } from '../../../../../api/common';
import { IUpdateUserV1Params } from '../../../../../api/user/index.d';
import useUserGroup from '../../../../../hooks/useUserGroup';

const UpdateUser = () => {
  const [form] = useForm<IUserFormFields>();
  const { roleList, updateRoleList } = useRole();
  const { userGroupList, updateUserGroupList } = useUserGroup();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [updateLoading, { setTrue, setFalse }] = useBoolean();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userManage.modalStatus[ModalName.Update_User]
  );
  const currentUser = useSelector<IReduxState, IUserResV1 | null>(
    (state) => state.userManage.selectUser
  );

  const close = React.useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Update_User,
        status: false,
      })
    );
  }, [dispatch, form]);

  const updateUser = async () => {
    const values = await form.validateFields();
    const params: IUpdateUserV1Params = {
      user_name: values.username,
      role_name_list: values.roleNameList,
      user_group_name_list: values.userGroupList,
      wechat_id: values.wechat,
    };
    if (!!values.email) {
      params.email = values.email;
    }
    if (values.username !== 'admin') {
      params.is_disabled = !!values.disabled;
    }
    setTrue();
    user
      .updateUserV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          close();
          message.success(
            t('user.updateUser.updateSuccessTips', { name: values.username })
          );
          EventEmitter.emit(EmitterKey.Refresh_User_list);
        }
      })
      .finally(() => {
        setFalse();
      });
  };

  React.useEffect(() => {
    if (visible) {
      updateRoleList();
      updateUserGroupList();
      form.setFieldsValue({
        username: currentUser?.user_name,
        email: currentUser?.email,
        roleNameList: currentUser?.role_name_list ?? [],
        userGroupList: currentUser?.user_group_name_list ?? [],
        wechat: currentUser?.wechat_id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRoleList, updateUserGroupList, visible]);

  return (
    <Modal
      title={t('user.updateUser.modalTitle')}
      visible={visible}
      closable={false}
      footer={
        <>
          <Button onClick={close} disabled={updateLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={updateUser} loading={updateLoading}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      {/* todo: userGroupList */}
      <UserForm
        form={form}
        roleNameList={roleList}
        isUpdate={true}
        userGroupList={userGroupList}
        isAdmin={currentUser?.user_name === 'admin'}
      />
    </Modal>
  );
};

export default UpdateUser;
