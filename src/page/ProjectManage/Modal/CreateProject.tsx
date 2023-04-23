import { useBoolean } from 'ahooks';
import { Button, message, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import project from '../../../api/project';
import { ICreateProjectV1Params } from '../../../api/project/index.d';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateProjectManageModalStatus } from '../../../store/projectManage';
import EventEmitter from '../../../utils/EventEmitter';
import { ProjectFormFields } from './ProjectForm';
import ProjectForm from './ProjectForm/ProjectForm';

const CreateProject: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = useForm<ProjectFormFields>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const modalVisibility = useSelector(
    (state: IReduxState) =>
      state.projectManage.modalStatus[ModalName.Create_Project]
  );

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateProjectManageModalStatus({
        modalName: ModalName.Create_Project,
        status: false,
      })
    );
  };

  const submit = async () => {
    const values = await form.validateFields();
    const params: ICreateProjectV1Params = {
      name: values.projectName,
      desc: values.projectDesc,
    };
    startSubmit();
    project
      .createProjectV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('projectManage.createProject.createSuccessTips', {
              name: params.name,
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

  return (
    <Modal
      open={modalVisibility}
      title={t('projectManage.createProject.modalTitle')}
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
      <ProjectForm form={form} />
    </Modal>
  );
};

export default CreateProject;
