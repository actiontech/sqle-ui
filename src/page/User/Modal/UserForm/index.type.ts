import { FormInstance } from 'antd';
import { IRoleTipResV1 } from '../../../../api/common';

export interface IUserFormFields {
  username: string;
  password: string;
  passwordAgain: string;
  email?: string;
  roleNameList?: string[];
}

export interface IUserFormProps {
  form: FormInstance<IUserFormFields>;
  roleNameList: IRoleTipResV1[];
  isUpdate?: boolean;
}
