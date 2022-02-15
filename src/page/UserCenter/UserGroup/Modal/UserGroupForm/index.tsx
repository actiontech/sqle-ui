import { FormInstance } from 'antd';
import { IRoleTipResV1, IUserTipResV1 } from '../../../../../api/common';
import UserGroupForm from './UserGroupForm';

export type UserGroupFormProps = {
  form?: FormInstance<UserGroupFormField>;
  roleList?: IRoleTipResV1[];
  userList?: IUserTipResV1[];
  isUpdate?: boolean;
};
export type UserGroupFormField = {
  userGroupName: string;
  userGroupDesc?: string;
  roleList?: string[];
  userList?: string[];
  isDisabled?: boolean;
};

export default UserGroupForm;
