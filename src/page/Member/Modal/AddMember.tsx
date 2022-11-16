import { useBoolean } from 'ahooks';
import { Button, message, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import user from '../../../api/user';
import { IAddMemberV1Params } from '../../../api/user/index.d';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateMemberModalStatus } from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { MemberFormFields } from './index.type';
import MemberForm from './MemberForm';

const AddMember: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projectName } = useCurrentProjectName();
  const [form] = useForm<MemberFormFields>();
  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();
  const modalVisibility = useSelector(
    (state: IReduxState) => state.member.modalStatus[ModalName.Add_Member]
  );

  const submit = async () => {
    const values = await form.validateFields();
    const params: IAddMemberV1Params = {
      project_name: projectName,
      is_owner: values.isOwner,
      roles: values.roles,
      user_name: values.username,
    };
    startSubmit();
    user
      .addMemberV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('member.addMember.successTips', {
              name: params.user_name,
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_Member_List);
          EventEmitter.emit(EmitterKey.Refresh_Filter_User_Tips);
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
        modalName: ModalName.Add_Member,
        status: false,
      })
    );
  };

  return (
    <Modal
      visible={modalVisibility}
      title={t('member.addMember.modalTitle')}
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
      <MemberForm form={form} projectName={projectName} />
    </Modal>
  );
};

export default AddMember;
