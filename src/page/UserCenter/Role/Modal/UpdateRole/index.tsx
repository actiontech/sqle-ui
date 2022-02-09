import React from 'react';
import { Button, message, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import RoleForm from '../RoleForm';
import { IRoleFormFields } from '../RoleForm/index.type';
import { updateUserManageModalStatus } from '../../../../../store/userManage';
import role from '../../../../../api/role';
import { ResponseCode } from '../../../../../data/common';
import { useBoolean } from 'ahooks';
import { IRoleResV2 } from '../../../../../api/common';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import useInstance from '../../../../../hooks/useInstance';
import useUsername from '../../../../../hooks/useUsername';
import useOperation from '../../../../../hooks/useOperation';
import useUserGroup from '../../../../../hooks/useUserGroup';

const UpdateRole = () => {
  const [form] = useForm<IRoleFormFields>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { instanceList, updateInstanceList } = useInstance();
  const { usernameList, updateUsernameList } = useUsername();
  const { operationList, updateOperationList } = useOperation();
  const { userGroupList, updateUserGroupList } = useUserGroup();

  const [updateLoading, { setTrue, setFalse }] = useBoolean();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userManage.modalStatus[ModalName.Update_Role]
  );
  const currentRole = useSelector<IReduxState, IRoleResV2 | null>(
    (state) => state.userManage.selectRole
  );

  const close = React.useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Update_Role,
        status: false,
      })
    );
  }, [dispatch, form]);

  const updateRole = React.useCallback(async () => {
    const values = await form.validateFields();
    setTrue();
    role
      .updateRoleV2({
        role_name: values.roleName,
        role_desc: values.roleDesc,
        instance_name_list: values.databases,
        user_name_list: values.usernames,
        user_group_name_list: values.userGroups,
        operation_code_list: values.operationCodes,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          close();
          message.success(
            t('role.updateRole.updateSuccessTips', { name: values.roleName })
          );
          EventEmitter.emit(EmitterKey.Refresh_Role_list);
          EventEmitter.emit(EmitterKey.Refresh_User_list);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [close, form, setFalse, setTrue, t]);

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        roleName: currentRole?.role_name,
        roleDesc: currentRole?.role_desc,
        usernames: currentRole?.user_name_list,
        databases: currentRole?.instance_name_list,
        userGroups: currentRole?.user_group_name_list,
        operationCodes: currentRole?.operation_list?.map(
          (e) => e.operation_code ?? ''
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  React.useEffect(() => {
    if (visible) {
      updateInstanceList();
      updateUsernameList();
      updateOperationList();
      updateUserGroupList();
    }
  }, [
    updateInstanceList,
    updateOperationList,
    updateUserGroupList,
    updateUsernameList,
    visible,
  ]);

  return (
    <Modal
      title={t('user.updateRole.modalTitle')}
      visible={visible}
      closable={false}
      footer={
        <>
          <Button onClick={close} disabled={updateLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={updateRole} loading={updateLoading}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <RoleForm
        isUpdate={true}
        form={form}
        instanceList={instanceList}
        usernameList={usernameList}
        operationList={operationList}
        userGroupList={userGroupList}
      />
    </Modal>
  );
};

export default UpdateRole;
