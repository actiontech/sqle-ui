import { FormInstance } from 'antd';
import { IUserTipResV1 } from '../../../../../api/common';
import UserGroupForm from './UserGroupForm';

export type UserGroupFormProps = {
  form?: FormInstance<UserGroupFormField>;
  userList?: IUserTipResV1[];
  isUpdate?: boolean;
};
export type UserGroupFormField = {
  userGroupName: string;
  userGroupDesc?: string;
  userList?: string[];
  isDisabled?: boolean;
};

export default UserGroupForm;
