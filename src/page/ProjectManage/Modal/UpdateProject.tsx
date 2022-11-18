import { useBoolean } from 'ahooks';
import { Button, message, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import project from '../../../api/project';
import { IUpdateProjectV1Params } from '../../../api/project/index.d';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateProjectManageModalStatus } from '../../../store/projectManage';
import EventEmitter from '../../../utils/EventEmitter';
import { ProjectFormFields } from './ProjectForm';
import ProjectForm from './ProjectForm/ProjectForm';

const UpdateProject: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = useForm<ProjectFormFields>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { modalVisibility, selectProjectItem } = useSelector(
    (state: IReduxState) => ({
      modalVisibility:
        state.projectManage.modalStatus[ModalName.Update_Project],
      selectProjectItem: state.projectManage.selectProject ?? undefined,
    })
  );

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateProjectManageModalStatus({
        modalName: ModalName.Update_Project,
        status: false,
      })
    );
  };

  const submit = async () => {
    const values = await form.validateFields();
    const params: IUpdateProjectV1Params = {
      project_name: selectProjectItem?.name ?? '',
      desc: values.projectDesc,
    };
    startSubmit();
    project
      .updateProjectV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('projectManage.updateProject.updateSuccessTips', {
              name: selectProjectItem?.name,
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_Project_List);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  useEffect(() => {
    if (modalVisibility) {
      form.setFieldsValue({
        projectDesc: selectProjectItem?.desc ?? '',
        projectName: selectProjectItem?.name ?? '',
      });
    }
  }, [form, modalVisibility, selectProjectItem?.desc, selectProjectItem?.name]);

  return (
    <Modal
      visible={modalVisibility}
      title={t('projectManage.updateProject.modalTitle')}
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
      <ProjectForm form={form} isUpdate={true} />
    </Modal>
  );
};

export default UpdateProject;
