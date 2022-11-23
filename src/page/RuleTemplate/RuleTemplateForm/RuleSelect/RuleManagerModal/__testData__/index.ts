import { IRuleResV1 } from '../../../../../../api/common';
import {
  RuleParamResV1TypeEnum,
  RuleResV1LevelEnum,
} from '../../../../../../api/common.enum';
export const ruleData: IRuleResV1 = {
  rule_name: 'ddl_check_collation_database',
  desc: '建议使用规定的数据库排序规则',
  level: RuleResV1LevelEnum.error,
  type: 'DDL规范',
  db_type: 'mysql',
  annotation: 'annotation',
};

export const editRuleData: IRuleResV1 = {
  rule_name: 'ddl_check_collation_database',
  desc: '建议使用规定的数据库排序规则',
  params: [
    {
      value: 'str',
      type: RuleParamResV1TypeEnum.string,
      key: 'str_key',
      desc: 'str_desc',
    },
    {
      value: '123',
      type: RuleParamResV1TypeEnum.int,
      key: 'int_key',
      desc: 'ine_desc',
    },
    {
      value: 'false',
      type: RuleParamResV1TypeEnum.bool,
      key: 'radio_key',
      desc: 'radio_desc',
    },
  ],
  level: RuleResV1LevelEnum.normal,
  type: 'DDL规范',
  db_type: 'mysql',
};
