import { FormInstance } from 'antd';
import { IOperationResV1 } from '../../../../../api/common.d';

export interface IRoleFormFields {
  roleName: string;
  roleDesc?: string;
  operationCodes?: number[];
  isDisabled?: boolean;
}

export interface IRoleFormProps {
  form: FormInstance<IRoleFormFields>;
  operationList: IOperationResV1[];
  isUpdate?: boolean;
}
