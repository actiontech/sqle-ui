import { useBoolean } from 'ahooks';
import { Button, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import user_group from '../../../../../api/user_group';
import { ResponseCode } from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateUserManageModalStatus } from '../../../../../store/userManage';
import EventEmitter from '../../../../../utils/EventEmitter';
import UserGroupForm, { UserGroupFormField } from '../UserGroupForm';
import useUserGroupFormOption from '../UserGroupForm/useUserGroupFormOption';

const AddUserGroup = () => {
  const visible = useSelector<IReduxState, boolean>(
    (state) => state.userManage.modalStatus[ModalName.Add_User_Group]
  );

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const close = () => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.Add_User_Group,
        status: false,
      })
    );
  };

  const [form] = useForm<UserGroupFormField>();

  const [requestLoading, { setTrue: startRequest, setFalse: requestFinish }] =
    useBoolean();

  const addUserGroup = async () => {
    const values = await form.validateFields();
    try {
      startRequest();
      const res = await user_group.CreateUserGroupV1({
        user_group_name: values.userGroupName,
        user_group_desc: values.userGroupDesc,
        user_name_list: values.userList,
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        close();
        message.success(
          t('userGroup.createUserGroup.successTips', {
            name: values.userGroupName,
          })
        );
        EventEmitter.emit(EmitterKey.Refresh_User_Group_List);
      }
    } finally {
      requestFinish();
    }
  };

  const { usernameList } = useUserGroupFormOption(visible);

  return (
    <Modal
      title={t('userGroup.createUserGroup.title')}
      visible={visible}
      closable={false}
      footer={
        <>
          <Button onClick={close} disabled={requestLoading}>
            {t('common.close')}
          </Button>
          <Button
            type="primary"
            onClick={addUserGroup}
            loading={requestLoading}
          >
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <UserGroupForm form={form} userList={usernameList} />
    </Modal>
  );
};

export default AddUserGroup;
