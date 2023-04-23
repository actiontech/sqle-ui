import { TagProps } from 'antd';
import { WorkflowRecordResV2StatusEnum } from '../../api/common.enum';
import { I18nKey } from '../../types/common.type';

export type OrderStatus = {
  [key in WorkflowRecordResV2StatusEnum | 'unknown']: {
    color: TagProps['color'];
    label: I18nKey;
  };
};
