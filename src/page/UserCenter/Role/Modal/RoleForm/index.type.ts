import { FormInstance } from 'antd';
import {
  IInstanceTipResV1,
  IOperationResV1,
  IUserGroupTipListItem,
  IUserTipResV1,
} from '../../../../../api/common.d';

export interface IRoleFormFields {
  roleName: string;
  roleDesc?: string;
  databases?: string[];
  usernames?: string[];
  operationCodes?: string[];
  userGroups?: string[];
}

export interface IRoleFormProps {
  form: FormInstance<IRoleFormFields>;
  instanceList: IInstanceTipResV1[];
  usernameList: IUserTipResV1[];
  operationList: IOperationResV1[];
  userGroupList: IUserGroupTipListItem[];
  isUpdate?: boolean;
}
