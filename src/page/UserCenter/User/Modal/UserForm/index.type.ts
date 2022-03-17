import { FormInstance } from 'antd';
import {
  IRoleTipResV1,
  IUserGroupTipListItem,
} from '../../../../../api/common.d';

export interface IUserFormFields {
  username: string;
  password: string;
  passwordAgain: string;
  email?: string;
  roleNameList?: string[];
  disabled: boolean;
  userGroupList?: string[];
  wechat?: string;
}

export interface IUserFormProps {
  form: FormInstance<IUserFormFields>;
  roleNameList: IRoleTipResV1[];
  userGroupList: IUserGroupTipListItem[];
  isUpdate?: boolean;
}
