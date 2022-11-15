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
import { IRoleResV1 } from '../../../../../api/common';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import useOperation from '../../../../../hooks/useOperation';

const UpdateRole = () => {
  const [form] = useForm<IRoleFormFields>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { operationList, updateOperationList } = useOperation();

  const [updateLoading, { setTrue, setFalse }] = useBoolean();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userManage.modalStatus[ModalName.Update_Role]
  );
  const currentRole = useSelector<IReduxState, IRoleResV1 | null>(
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
      .updateRoleV1({
        role_name: values.roleName,
        role_desc: values.roleDesc,
        operation_code_list: values.operationCodes,
        is_disabled: values.isDisabled,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          close();
          message.success(
            t('role.updateRole.updateSuccessTips', { name: values.roleName })
          );
          EventEmitter.emit(EmitterKey.Refresh_Role_list);
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
        operationCodes: currentRole?.operation_list?.map((e) => e.op_code ?? 0),
        isDisabled: currentRole?.is_disabled ?? false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  React.useEffect(() => {
    if (visible) {
      updateOperationList();
    }
  }, [updateOperationList, visible]);

  return (
    <Modal
      title={t('role.updateRole.modalTitle')}
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
      <RoleForm isUpdate={true} form={form} operationList={operationList} />
    </Modal>
  );
};

export default UpdateRole;
