import { FormInstance } from 'antd';
import {
  IManagementPermissionResV1,
  IUserGroupTipListItem,
} from '../../../../../api/common.d';

export interface IUserFormFields {
  username: string;
  password: string;
  passwordAgain: string;
  email?: string;
  disabled: boolean;
  userGroupList?: string[];
  wechat?: string;
  managementPermissionCodeList?: number[];
}

export interface IUserFormProps {
  form: FormInstance<IUserFormFields>;
  userGroupList: IUserGroupTipListItem[];
  isUpdate?: boolean;
  isAdmin?: boolean;
  managementPermissionList: IManagementPermissionResV1[];
}
