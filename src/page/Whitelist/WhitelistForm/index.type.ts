import { FormInstance } from 'antd';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '../../../api/common.enum';

export type WhitelistFormFields = {
  desc?: string;
  sql: string;
  matchType: CreateAuditWhitelistReqV1MatchTypeEnum;
};

export type WhitelistFormProps = {
  form: FormInstance<WhitelistFormFields>;
};
