import { FormInstance } from 'antd';
import { IBindRoleReqV1 } from '../../../api/common';

export type MemberFormFields = {
  isOwner: boolean;
  roles: IBindRoleReqV1[];
  username: string;
};

export type MemberFormProps = {
  form: FormInstance<MemberFormFields>;
  isUpdate?: boolean;
};
