export const instanceRule = [
  {
    rule_name: 'all_check_where_is_invalid',
    desc: '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
    params: [],
    level: 'error',
    db_type: 'mysql',
  },
  {
    rule_name: 'ddl_check_alter_table_need_merge',
    desc: '存在多条对同一个表的修改语句，建议合并成一个ALTER语句',
    params: [],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'ddl_check_collation_database',
    desc: '建议使用规定的数据库排序规则',
    params: [
      {
        value: 'utf8mb4_0900_ai_ci',
        type: 'string',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'ddl_check_column_blob_default_is_not_null',
    desc: 'BLOB 和 TEXT 类型的字段不可指定非 NULL 的默认值',
    params: [],
    level: 'error',
    db_type: 'mysql',
  },
  {
    rule_name: 'ddl_check_column_blob_notice',
    desc: '不建议使用 BLOB 或 TEXT 类型',
    params: [],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'ddl_check_column_blob_with_not_null',
    desc: 'BLOB 和 TEXT 类型的字段不建议设置为 NOT NULL',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_char_length',
    desc: 'char长度大于20时，必须使用varchar类型',
    params: [],
    level: 'error',
    db_type: 'mysql',
  },
  {
    rule_name: 'ddl_check_column_enum_notice',
    desc: '不建议使用 ENUM 类型',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_set_notice',
    desc: '不建议使用 SET 类型',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_timestamp_without_default',
    desc: 'timestamp 类型的列必须添加默认值',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_varchar_max',
    desc: '禁止使用 varchar(max)',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_without_comment',
    desc: '列建议添加注释',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_without_default',
    desc: '除了自增列及大字段列之外，每个列都必须添加默认值',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_composite_index_max',
    desc: '复合索引的列数量不建议超过阈值',
    params: [
      {
        value: '3',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_database_suffix',
    desc: '数据库名称建议以"_DB"结尾',
    params: [],
    db_type: 'mysql',

    level: 'notice',
  },
  {
    rule_name: 'ddl_check_decimal_type_column',
    desc: '精确浮点数建议使用DECIMAL',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_index_column_with_blob',
    desc: '禁止将blob类型的列加入索引',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_index_count',
    desc: '索引个数建议不超过阈值',
    params: [
      {
        value: '5',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_index_option',
    desc: '建议选择可选性超过阈值字段作为索引',
    params: [
      {
        value: '0.7',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_index_prefix',
    desc: '普通索引必须要以"idx_"为前缀',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_indexes_exist_before_creat_constraints',
    desc: '建议创建约束前,先行创建索引',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_is_exist_limit_offset',
    desc: '使用LIMIT分页时,避免使用LIMIT M,N',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_object_name_length',
    desc: '表名、列名、索引名的长度不能大于64字节',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_object_name_using_cn',
    desc: '数据库对象命名禁止使用中文',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_object_name_using_keyword',
    desc: '数据库对象命名禁止使用关键字',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_name',
    desc: '建议主键命名为"PK_表名"',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_pk_not_exist',
    desc: '表必须有主键',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_prohibit_auto_increment',
    desc: '主键禁止使用自增',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_without_auto_increment',
    desc: '主键建议使用自增',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_without_bigint_unsigned',
    desc: '主键建议使用 bigint 无符号类型，即 bigint unsigned',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_table_partition',
    desc: '不建议使用分区表相关功能',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_table_without_comment',
    desc: '表建议添加注释',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_table_without_if_not_exists',
    desc: '新建表必须加入if not exists create，保证重复执行不报错',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_table_without_innodb_utf8mb4',
    desc: '建议使用Innodb引擎,utf8mb4字符集',
    params: [],
    db_type: 'mysql',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_transaction_isolation_level',
    db_type: 'mysql',
    desc: '事物隔离级别建议设置成RC',
    params: [],
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_unique_index',
    desc: 'unique索引名必须使用 IDX_UK_表名_字段名',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_unique_index_prefix',
    desc: 'unique索引必须要以"uniq_"为前缀',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_disable_drop_statement',
    desc: '禁止除索引外的drop操作',
    params: [],
    db_type: 'mysql',
    level: 'error',
  },
  {
    rule_name: 'ddl_disable_fk',
    desc: '禁止使用外键',
    params: [],
    level: 'error',
    db_type: 'mysql',
  },
  {
    rule_name: 'ddl_osc_min_size',
    desc: '改表时，表空间超过指定大小(MB)审核时输出osc改写建议',
    params: [
      {
        value: '16',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'normal',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_batch_insert_lists_max',
    desc: '单条insert语句，建议批量插入不超过阈值',
    params: [
      {
        value: '5000',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_fuzzy_search',
    desc: '禁止使用全模糊搜索或左模糊搜索',
    params: [],
    level: 'error',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_insert_columns_exist',
    desc: 'insert 语句必须指定column',
    params: [],
    level: 'error',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_is_after_union_distinct',
    desc: '建议使用UNION ALL,替代UNION',
    params: [],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_limit_must_exist',
    desc: 'delete/update 语句必须有limit条件',
    params: [],
    level: 'error',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_needless_func',
    desc: '避免使用不必要的内置函数',
    params: [
      {
        value: 'sha(),sqrt(),md5()',
        type: 'string',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_number_of_join_tables',
    desc: '使用JOIN连接表查询建议不超过阈值',
    params: [
      {
        value: '3',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_select_for_update',
    desc: '建议避免使用select for update',
    params: [],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_where_exist_func',
    desc: '避免对条件字段使用函数操作',
    params: [],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_where_exist_implicit_conversion',
    desc: '条件字段存在数值和字符的隐式转换',
    params: [],
    level: 'notice',
    db_type: 'mysql',
  },
  {
    rule_name: 'dml_check_where_exist_not',
    desc: '不建议对条件字段使用负向查询',
    params: [],
    level: 'notice',
    db_type: 'mysql',
  },
];

export const allRulesWithType = [
  {
    annotation: 'annotation1',
    rule_name: 'all_check_where_is_invalid',
    desc: '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
    params: [],
    level: 'error',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    annotation: 'annotation2',
    rule_name: 'ddl_check_alter_table_need_merge',
    desc: '存在多条对同一个表的修改语句，建议合并成一个ALTER语句',
    params: [],
    level: 'notice',
    type: '使用建议',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_collation_database',
    desc: '建议使用规定的数据库排序规则',
    params: [
      {
        value: 'utf8mb4_0900_ai_ci',
        type: 'string',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_column_blob_default_is_not_null',
    desc: 'BLOB 和 TEXT 类型的字段不可指定非 NULL 的默认值',
    params: [],
    level: 'error',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_column_blob_notice',
    desc: '不建议使用 BLOB 或 TEXT 类型',
    params: [],
    level: 'notice',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_column_blob_with_not_null',
    desc: 'BLOB 和 TEXT 类型的字段不建议设置为 NOT NULL',
    params: [],
    level: 'error',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_column_char_length',
    desc: 'char长度大于20时，必须使用varchar类型',
    params: [],
    level: 'error',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_column_enum_notice',
    desc: '不建议使用 ENUM 类型',
    params: [],
    level: 'notice',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_column_set_notice',
    desc: '不建议使用 SET 类型',
    params: [],
    level: 'notice',
    type: 'DDL规范',
    db_type: 'mysql',
  },
  {
    rule_name: 'ddl_check_column_timestamp_without_default',
    desc: 'timestamp 类型的列必须添加默认值',
    params: [],
    level: 'error',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_column_varchar_max',
    desc: '禁止使用 varchar(max)',
    params: [],
    level: 'error',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_column_without_comment',
    desc: '列建议添加注释',
    params: [],
    level: 'notice',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_column_without_default',
    desc: '除了自增列及大字段列之外，每个列都必须添加默认值',
    params: [],
    level: 'error',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_composite_index_max',
    desc: '复合索引的列数量不建议超过阈值',
    params: [
      {
        value: '3',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    type: '索引规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_create_function',
    desc: '禁止使用自定义函数',
    params: [],
    level: 'error',
    type: '使用建议',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_create_procedure',
    desc: '禁止使用存储过程',
    params: [],
    level: 'error',
    type: '使用建议',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_create_trigger',
    desc: '禁止使用触发器',
    params: [],
    level: 'error',
    type: '使用建议',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_create_view',
    desc: '禁止使用视图',
    params: [],
    level: 'error',
    type: '使用建议',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_database_suffix',
    desc: '数据库名称建议以"_DB"结尾',
    params: [],
    level: 'notice',
    type: '命名规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_decimal_type_column',
    desc: '精确浮点数建议使用DECIMAL',
    params: [],
    level: 'notice',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_index_column_with_blob',
    desc: '禁止将blob类型的列加入索引',
    params: [],
    level: 'error',
    type: '索引规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_index_count',
    desc: '索引个数建议不超过阈值',
    params: [
      {
        value: '5',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    type: '索引规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_index_option',
    desc: '建议选择可选性超过阈值字段作为索引',
    params: [
      {
        value: '0.7',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_index_prefix',
    desc: '普通索引必须要以"idx_"为前缀',
    params: [],
    level: 'error',
    type: '命名规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_indexes_exist_before_creat_constraints',
    desc: '建议创建约束前,先行创建索引',
    params: [],
    level: 'notice',
    type: '索引规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_is_exist_limit_offset',
    desc: '使用LIMIT分页时,避免使用LIMIT M,N',
    params: [],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_object_name_length',
    desc: '表名、列名、索引名的长度不能大于64字节',
    params: [],
    level: 'error',
    type: '命名规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_object_name_using_cn',
    desc: '数据库对象命名不能使用英文、下划线、数字之外的字符',
    params: [],
    level: 'error',
    type: '命名规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_object_name_using_keyword',
    desc: '数据库对象命名禁止使用关键字',
    params: [],
    level: 'error',
    type: '命名规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_pk_name',
    desc: '建议主键命名为"PK_表名"',
    params: [],
    level: 'notice',
    type: '命名规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_pk_not_exist',
    desc: '表必须有主键',
    params: [],
    level: 'error',
    type: '索引规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_pk_prohibit_auto_increment',
    desc: '主键禁止使用自增',
    params: [],
    level: 'error',
    type: '索引规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_pk_without_auto_increment',
    desc: '主键建议使用自增',
    params: [],
    level: 'error',
    type: '索引规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_pk_without_bigint_unsigned',
    desc: '主键建议使用 bigint 无符号类型，即 bigint unsigned',
    params: [],
    level: 'error',
    type: '索引规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_table_partition',
    desc: '不建议使用分区表相关功能',
    params: [],
    level: 'notice',
    type: '使用建议',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_table_without_comment',
    desc: '表建议添加注释',
    params: [],
    level: 'notice',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_table_without_if_not_exists',
    desc: '新建表必须加入if not exists create，保证重复执行不报错',
    params: [],
    level: 'error',
    type: '使用建议',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_table_without_innodb_utf8mb4',
    desc: '建议使用Innodb引擎,utf8mb4字符集',
    params: [],
    level: 'notice',
    type: 'DDL规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_transaction_isolation_level',
    desc: '事物隔离级别建议设置成RC',
    params: [],
    level: 'notice',
    type: '使用建议',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_unique_index',
    desc: 'unique索引名必须使用 IDX_UK_表名_字段名',
    params: [],
    level: 'error',
    type: '命名规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_check_unique_index_prefix',
    desc: 'unique索引必须要以"uniq_"为前缀',
    params: [],
    level: 'error',
    type: '命名规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_disable_drop_statement',
    desc: '禁止除索引外的drop操作',
    params: [],
    level: 'error',
    type: '使用建议',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_disable_fk',
    desc: '禁止使用外键',
    params: [],
    level: 'error',
    type: '索引规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'ddl_osc_min_size',
    desc: '改表时，表空间超过指定大小(MB)审核时输出osc改写建议',
    params: [
      {
        value: '16',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'normal',
    type: '全局配置',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_batch_insert_lists_max',
    desc: '单条insert语句，建议批量插入不超过阈值',
    params: [
      {
        value: '5000',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_explain_access_type_all',
    desc: '查询的扫描不建议超过指定行数（默认值：10000）',
    params: [
      {
        value: '10000',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'warn',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_explain_extra_using_filesort',
    desc: '该查询使用了文件排序',
    params: [],
    level: 'warn',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_explain_extra_using_temporary',
    desc: '该查询使用了临时表',
    params: [],
    level: 'warn',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_fuzzy_search',
    desc: '禁止使用全模糊搜索或左模糊搜索',
    params: [],
    level: 'error',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_insert_columns_exist',
    desc: 'insert 语句必须指定column',
    params: [],
    level: 'error',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_is_after_union_distinct',
    desc: '建议使用UNION ALL,替代UNION',
    params: [],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_limit_must_exist',
    desc: 'delete/update 语句必须有limit条件',
    params: [],
    level: 'error',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_needless_func',
    desc: '避免使用不必要的内置函数',
    params: [
      {
        value: 'sha(),sqrt(),md5()',
        type: 'string',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_number_of_join_tables',
    desc: '使用JOIN连接表查询建议不超过阈值',
    params: [
      {
        value: '3',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_select_for_update',
    desc: '建议避免使用select for update',
    params: [],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_where_exist_func',
    desc: '避免对条件字段使用函数操作',
    params: [],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_where_exist_implicit_conversion',
    desc: '条件字段存在数值和字符的隐式转换',
    params: [],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_where_exist_not',
    desc: '不建议对条件字段使用负向查询',
    params: [],
    level: 'notice',
    type: 'DML规范',
    db_type: 'mysql',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_where_exist_null',
    desc: '不建议对条件字段使用 NULL 值判断',
    params: [],
    level: 'notice',
    type: 'DML规范',
    db_type: 'oracle',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_where_exist_scalar_sub_queries',
    desc: '避免使用标量子查询',
    params: [],
    level: 'notice',
    type: 'DML规范',
    db_type: 'oracle',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_with_limit',
    desc: 'delete/update 语句不能有limit条件',
    params: [],
    level: 'error',
    type: 'DML规范',
    db_type: 'oracle',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_check_with_order_by',
    desc: 'delete/update 语句不能有order by',
    params: [],
    level: 'error',
    type: 'DML规范',
    db_type: 'oracle',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_disable_select_all_column',
    desc: '不建议使用select *',
    params: [],
    level: 'notice',
    type: 'DML规范',
    db_type: 'oracle',
    is_custom_rule: false,
  },
  {
    rule_name: 'dml_rollback_max_rows',
    desc: '在 DML 语句中预计影响行数超过指定值则不回滚',
    params: [
      {
        value: '1000',
        type: 'int',
        key: 'key',
        desc: 'desc',
      },
    ],
    level: 'notice',
    type: '全局配置',
    db_type: 'oracle',
    is_custom_rule: false,
  },
];
