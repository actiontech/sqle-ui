import { FormInstance } from 'antd';
import { IRoleTipResV1 } from '../../../../../api/common.d';

export interface IUserFormFields {
  username: string;
  password: string;
  passwordAgain: string;
  email?: string;
  roleNameList?: string[];
  disabled: boolean;
  userGroupList?: string[];
}

export interface IUserFormProps {
  form: FormInstance<IUserFormFields>;
  roleNameList: IRoleTipResV1[];
  userGroupList: string[];
  isUpdate?: boolean;
}
