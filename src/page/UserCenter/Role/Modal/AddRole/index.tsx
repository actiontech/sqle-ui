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
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import useOperation from '../../../../../hooks/useOperation';

const AddRole = () => {
  const [form] = useForm<IRoleFormFields>();
  const { operationList, updateOperationList } = useOperation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [createLoading, { setTrue, setFalse }] = useBoolean();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userManage.modalStatus[ModalName.Add_Role]
  );

  const close = React.useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Add_Role,
        status: false,
      })
    );
  }, [dispatch, form]);

  const addRole = React.useCallback(async () => {
    const values = await form.validateFields();
    setTrue();
    role
      .createRoleV1({
        role_name: values.roleName,
        role_desc: values.roleDesc,
        operation_code_list: values.operationCodes,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          close();
          message.success(
            t('role.createRole.createSuccessTips', { name: values.roleName })
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
      updateOperationList();
    }
  }, [updateOperationList, visible]);

  return (
    <Modal
      title={t('role.createRole.modalTitle')}
      visible={visible}
      closable={false}
      footer={
        <>
          <Button onClick={close} disabled={createLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={addRole} loading={createLoading}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <RoleForm form={form} operationList={operationList} />
    </Modal>
  );
};

export default AddRole;
