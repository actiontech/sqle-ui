import { UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum } from '../../../../../api/common.enum';

export type SubscribeNoticeFormFields = {
  interval: number;
  level: UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum;
  emailEnable: boolean;
  webhooksEnable: boolean;
  webhooksUrl: string;
  template: string;
};
