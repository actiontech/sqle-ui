import { TagProps } from 'antd';
import { WorkflowResV1StatusEnum } from '../../api/common.enum';
import { I18nKey } from '../../types/common.type';

export type OrderStatus = {
  [key in WorkflowResV1StatusEnum | 'unknown']: {
    color: TagProps['color'];
    label: I18nKey;
  };
};
