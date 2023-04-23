import { IRuleResV1 } from '../../../api/common';
import rule_template from '../../../api/rule_template';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

export const projectTemplateRules = [
  {
    rule_name: 'all_check_where_is_invalid',
    desc: '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
    annotation: '',
    level: 'error',
    type: 'DML规范',
    db_type: 'MySQL',
  },
  {
    rule_name: 'ddl_check_alter_table_need_merge',
    desc: '存在多条对同一个表的修改语句，建议合并成一个ALTER语句',
    annotation: '',
    level: 'notice',
    type: '使用建议',
    db_type: 'MySQL',
  },
] as IRuleResV1[];

export const globalTemplateRules = [
  {
    rule_name: 'ddl_check_index_too_many',
    desc: '检查DDL创建的新索引对应字段是否已存在过多索引',
    annotation: '',
    level: 'warn',
    type: '索引规范',
    db_type: 'MySQL',
    params: [
      {
        key: 'first_key',
        value: '2',
        desc: '单字段的索引数最大值',
        type: 'int',
      },
    ],
  },
  {
    rule_name: 'ddl_check_indexes_exist_before_creat_constraints',
    desc: '建议创建约束前,先行创建索引',
    annotation: '',
    level: 'notice',
    type: '索引规范',
    db_type: 'MySQL',
  },
  {
    rule_name: 'ddl_check_is_exist_limit_offset',
    desc: '使用LIMIT分页时,避免使用LIMIT M,N',
    annotation: '',
    level: 'notice',
    type: 'DML规范',
    db_type: 'MySQL',
  },
] as IRuleResV1[];

export const allRules = [
  {
    rule_name: 'all_check_where_is_invalid',
    desc: '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
    annotation:
      'SQL缺少where条件在执行时会进行全表扫描产生额外开销，建议在大数据量高并发环境下开启，避免影响数据库查询性能',
    level: 'error',
    type: 'DML规范',
    db_type: 'MySQL',
  },
  {
    rule_name: 'ddl_check_alter_table_need_merge',
    desc: '存在多条对同一个表的修改语句，建议合并成一个ALTER语句',
    annotation: '',
    level: 'notice',
    type: '使用建议',
    db_type: 'MySQL',
  },
  {
    rule_name: 'ddl_check_index_too_many',
    desc: '检查DDL创建的新索引对应字段是否已存在过多索引',
    annotation: '',
    level: 'warn',
    type: '索引规范',
    db_type: 'MySQL',
    params: [
      {
        key: 'first_key',
        value: '2',
        desc: '单字段的索引数最大值',
        type: 'int',
      },
    ],
  },
  {
    rule_name: 'ddl_check_indexes_exist_before_creat_constraints',
    desc: '建议创建约束前,先行创建索引',
    annotation: '',
    level: 'notice',
    type: '索引规范',
    db_type: 'MySQL',
  },
  {
    rule_name: 'ddl_check_is_exist_limit_offset',
    desc: '使用LIMIT分页时,避免使用LIMIT M,N',
    annotation: '',
    level: 'notice',
    type: 'DML规范',
    db_type: 'MySQL',
  },
  {
    rule_name: 'ddl_check_pk_without_bigint_unsigned',
    desc: '主键建议使用 bigint 无符号类型，即 bigint unsigned',
    annotation: '',
    level: 'error',
    type: '索引规范',
    db_type: 'MySQL',
  },
] as IRuleResV1[];

export const mockGetProjectTemplateRules = () => {
  const spy = jest.spyOn(rule_template, 'getProjectRuleTemplateV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      db_type: 'MySQL',
      rule_list: projectTemplateRules,
    })
  );
  return spy;
};

export const mockGetGlobalTemplateRules = () => {
  const spy = jest.spyOn(rule_template, 'getRuleTemplateV1');
  spy.mockImplementation(() =>
    resolveThreeSecond({
      db_type: 'Oracle',
      rule_list: globalTemplateRules,
    })
  );
  return spy;
};

export const mockGetAllRules = () => {
  const spy = jest.spyOn(rule_template, 'getRuleListV1');
  spy.mockImplementation(() => resolveThreeSecond(allRules));
  return spy;
};
