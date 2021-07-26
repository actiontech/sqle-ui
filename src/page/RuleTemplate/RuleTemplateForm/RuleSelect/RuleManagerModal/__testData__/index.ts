import { RuleResV1LevelEnum } from '../../../../../../api/common.enum';
import { IRuleResV1 } from '../../../../../../api/common';
export const ruleData: IRuleResV1 = {
  rule_name: 'ddl_check_collation_database',
  desc: '建议使用规定的数据库排序规则',
  value: 'utf8mb4_0900_ai_ci',
  level: RuleResV1LevelEnum.error,
  type: 'DDL规范',
};
export const ruleDataNoValue: IRuleResV1 = {
  rule_name: 'ddl_check_collation_database',
  desc: '建议使用规定的数据库排序规则',
  value: undefined,
  level: RuleResV1LevelEnum.error,
  type: 'DDL规范',
};
export const editRuleData = {
  rule_name: 'ddl_check_collation_database',
  desc: '建议使用规定的数据库排序规则',
  value: 'test',
  level: RuleResV1LevelEnum.normal,
  type: 'DDL规范',
};
