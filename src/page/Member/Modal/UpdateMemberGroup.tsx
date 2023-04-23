import { useBoolean } from 'ahooks';
import { Button, message, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import user_group from '../../../api/user_group';
import { IUpdateMemberGroupV1Params } from '../../../api/user_group/index.d';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateMemberModalStatus } from '../../../store/member';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import { MemberGroupFormFields } from './index.type';
import MemberGroupForm from './MemberGroupForm';

const UpdateMemberGroup: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projectName } = useCurrentProjectName();
  const [form] = useForm<MemberGroupFormFields>();
  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();
  const { modalVisibility, selectMemberGroup } = useSelector(
    (state: IReduxState) => ({
      modalVisibility: state.member.modalStatus[ModalName.Update_Member_Group],
      selectMemberGroup: state.member.selectMemberGroup,
    })
  );

  const submit = async () => {
    const values = await form.validateFields();
    const params: IUpdateMemberGroupV1Params = {
      project_name: projectName,
      roles: values.roles,
      user_group_name: values.userGroupName,
    };
    startSubmit();
    user_group
      .updateMemberGroupV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('member.updateMemberGroup.successTips', {
              name: params.user_group_name,
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_Member_Group_List);
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
        modalName: ModalName.Update_Member_Group,
        status: false,
      })
    );
  };

  useEffect(() => {
    if (modalVisibility) {
      form.setFieldsValue({
        roles: selectMemberGroup?.roles,
        userGroupName: selectMemberGroup?.user_group_name,
      });
    }
  }, [
    form,
    modalVisibility,
    selectMemberGroup?.roles,
    selectMemberGroup?.user_group_name,
  ]);

  return (
    <Modal
      open={modalVisibility}
      title={t('member.updateMemberGroup.modalTitle')}
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
      <MemberGroupForm form={form} isUpdate={true} projectName={projectName} />
    </Modal>
  );
};

export default UpdateMemberGroup;
