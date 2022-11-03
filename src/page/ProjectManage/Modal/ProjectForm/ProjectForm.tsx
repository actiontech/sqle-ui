import { Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { ProjectFormFields, ProjectFormProps } from '.';
import { ModalFormLayout } from '../../../../data/common';
import { nameRule } from '../../../../utils/FormRule';

const ProjectForm: React.FC<ProjectFormProps> = ({
  form,
  isUpdate = false,
}) => {
  const { t } = useTranslation();

  return (
    <Form<ProjectFormFields> form={form} {...ModalFormLayout}>
      <Form.Item
        name="projectName"
        label={t('projectManage.projectForm.projectName')}
        validateFirst={true}
        rules={[
          {
            required: true,
          },
          ...nameRule(),
        ]}
      >
        <Input disabled={isUpdate} />
      </Form.Item>

      <Form.Item
        name="projectDesc"
        label={t('projectManage.projectForm.projectDesc')}
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
};

export default ProjectForm;
