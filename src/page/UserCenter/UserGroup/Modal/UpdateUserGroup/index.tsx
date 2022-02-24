import { useBoolean } from 'ahooks';
import { Button, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IUserGroupListItemResV1 } from '../../../../../api/common';
import user_group from '../../../../../api/user_group';
import { ResponseCode } from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateUserManageModalStatus } from '../../../../../store/userManage';
import EventEmitter from '../../../../../utils/EventEmitter';
import UserGroupForm, { UserGroupFormField } from '../UserGroupForm';
import useUserGroupFormOption from '../UserGroupForm/useUserGroupFormOption';

const UpdateUserGroup = () => {
  const visible = useSelector<IReduxState, boolean>(
    (state) => state.userManage.modalStatus[ModalName.Update_User_Group]
  );

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const close = () => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Update_User_Group,
        status: false,
      })
    );
  };

  const [form] = useForm<UserGroupFormField>();

  const [createLoading, { setTrue: startRequest, setFalse: requestFinish }] =
    useBoolean();

  const updateUserGroup = async () => {
    const values = await form.validateFields();
    try {
      startRequest();
      const res = await user_group.updateUserGroupV1({
        user_group_name: values.userGroupName,
        user_group_desc: values.userGroupDesc,
        role_name_list: values.roleList,
        user_name_list: values.userList,
        is_disabled: values.isDisabled,
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        close();
        message.success(
          t('userGroup.updateUserGroup.successTips', {
            name: values.userGroupName,
          })
        );
        EventEmitter.emit(EmitterKey.Refresh_User_Group_List);
      }
    } finally {
      requestFinish();
    }
  };

  const currentUserGroup = useSelector<
    IReduxState,
    IUserGroupListItemResV1 | null
  >((state) => state.userManage.selectUserGroup);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        userGroupName: currentUserGroup?.user_group_name,
        userGroupDesc: currentUserGroup?.user_group_desc,
        isDisabled: currentUserGroup?.is_disabled,
        roleList: currentUserGroup?.role_name_list,
        userList: currentUserGroup?.user_name_list,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const { roleList, usernameList } = useUserGroupFormOption(visible);

  return (
    <Modal
      title={t('userGroup.updateUserGroup.title')}
      visible={visible}
      closable={false}
      footer={
        <>
          <Button onClick={close} disabled={createLoading}>
            {t('common.close')}
          </Button>
          <Button
            type="primary"
            onClick={updateUserGroup}
            loading={createLoading}
          >
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <UserGroupForm
        form={form}
        roleList={roleList}
        userList={usernameList}
        isUpdate={true}
      />
    </Modal>
  );
};

export default UpdateUserGroup;
