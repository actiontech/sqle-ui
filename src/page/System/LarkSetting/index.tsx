import { TestFeishuConfigurationReqV1AccountTypeEnum } from '../../../api/common.enum';
import LarkSetting from './LarkSetting';

export default LarkSetting;

export type FormFields = {
  enabled: boolean;
  appKey: string;
  appSecret: string;
};

export type TestFormFields = {
  receiveType: TestFeishuConfigurationReqV1AccountTypeEnum;
  receivePhone: string;
  receiveEmail: string;
};
