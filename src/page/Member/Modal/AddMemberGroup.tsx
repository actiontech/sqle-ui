import { useBoolean } from 'ahooks';
import { Button, message, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import user_group from '../../../api/user_group';
import { IAddMemberGroupV1Params } from '../../../api/user_group/index.d';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateMemberModalStatus } from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { MemberGroupFormFields } from './index.type';
import MemberGroupForm from './MemberGroupForm';

const AddMemberGroup: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projectName } = useCurrentProjectName();
  const [form] = useForm<MemberGroupFormFields>();
  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();
  const modalVisibility = useSelector(
    (state: IReduxState) => state.member.modalStatus[ModalName.Add_Member_Group]
  );

  const submit = async () => {
    const values = await form.validateFields();
    const params: IAddMemberGroupV1Params = {
      project_name: projectName,
      roles: values.roles,
      user_group_name: values.userGroupName,
    };
    startSubmit();
    user_group
      .addMemberGroupV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('member.addMemberGroup.successTips', {
              name: params.user_group_name,
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_Member_Group_List);
          EventEmitter.emit(EmitterKey.Refresh_Filter_User_Group_Tips);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateMemberModalStatus({
        modalName: ModalName.Add_Member_Group,
        status: false,
      })
    );
  };

  return (
    <Modal
      open={modalVisibility}
      title={t('member.addMemberGroup.modalTitle')}
      closable={false}
      footer={
        <>
          <Button onClick={closeModal} disabled={submitLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={submit} loading={submitLoading}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <MemberGroupForm form={form} projectName={projectName} />
    </Modal>
  );
};

export default AddMemberGroup;
