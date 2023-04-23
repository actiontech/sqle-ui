import { useBoolean } from 'ahooks';
import { Button, message, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import user from '../../../api/user';
import { IUpdateMemberV1Params } from '../../../api/user/index.d';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateMemberModalStatus } from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { MemberFormFields } from './index.type';
import MemberForm from './MemberForm';

const UpdateMember: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projectName } = useCurrentProjectName();
  const [form] = useForm<MemberFormFields>();
  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();
  const { modalVisibility, selectMember } = useSelector(
    (state: IReduxState) => ({
      modalVisibility: state.member.modalStatus[ModalName.Update_Member],
      selectMember: state.member.selectMember,
    })
  );

  const submit = async () => {
    const values = await form.validateFields();
    const params: IUpdateMemberV1Params = {
      project_name: projectName,
      is_manager: values.isManager,
      roles: values.roles,
      user_name: values.username,
    };
    startSubmit();
    user
      .updateMemberV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('member.updateMember.successTips', {
              name: params.user_name,
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_Member_List);
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
        modalName: ModalName.Update_Member,
        status: false,
      })
    );
  };

  useEffect(() => {
    if (modalVisibility) {
      form.setFieldsValue({
        isManager: selectMember?.is_manager,
        roles: selectMember?.roles,
        username: selectMember?.user_name,
      });
    }
  }, [
    form,
    modalVisibility,
    selectMember?.is_manager,
    selectMember?.roles,
    selectMember?.user_name,
  ]);

  return (
    <Modal
      open={modalVisibility}
      title={t('member.updateMember.modalTitle')}
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
      <MemberForm form={form} isUpdate={true} projectName={projectName} />
    </Modal>
  );
};

export default UpdateMember;
