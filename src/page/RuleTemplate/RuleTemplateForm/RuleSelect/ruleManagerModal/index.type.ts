import { IRuleResV1 } from '../../../../../api/common';
import { FormInstance } from 'antd';

export type RuleManagerFormProps = {
  visible: boolean;
  ruleData: IRuleResV1;
  setVisibleFalse:() => void
  submit: () => void;
  form: FormInstance<IRuleResV1>;
}