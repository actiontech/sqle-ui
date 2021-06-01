import { FormInstance } from 'antd';
import { IInstanceTipResV1, IUserTipResV1 } from '../../../../api/common';

export interface IRoleFormFields {
  roleName: string;
  roleDesc?: string;
  databases?: string[];
  usernames?: string[];
}

export interface IRoleFormProps {
  form: FormInstance<IRoleFormFields>;
  instanceList: IInstanceTipResV1[];
  usernameList: IUserTipResV1[];
  isUpdate?: boolean;
}
