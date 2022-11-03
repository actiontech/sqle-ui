import { FormInstance } from 'antd';
import ProjectForm from './ProjectForm';

export type ProjectFormFields = {
  projectName: string;
  projectDesc: string;
};

export type ProjectFormProps = {
  form: FormInstance<ProjectFormFields>;
  isUpdate?: boolean;
};

export default ProjectForm;
