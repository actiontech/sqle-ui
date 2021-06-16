export const allRules = [
  {
    rule_name: 'all_check_where_is_invalid',
    desc: '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_alter_table_need_merge',
    desc: '存在多条对同一个表的修改语句，建议合并成一个ALTER语句',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_collation_database',
    desc: '建议使用规定的数据库排序规则',
    value: 'utf8mb4_0900_ai_ci',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_blob_default_is_not_null',
    desc: 'BLOB 和 TEXT 类型的字段不可指定非 NULL 的默认值',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_blob_notice',
    desc: '不建议使用 BLOB 或 TEXT 类型',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_blob_with_not_null',
    desc: 'BLOB 和 TEXT 类型的字段不建议设置为 NOT NULL',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_char_length',
    desc: 'char长度大于20时，必须使用varchar类型',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_enum_notice',
    desc: '不建议使用 ENUM 类型',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_set_notice',
    desc: '不建议使用 SET 类型',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_timestamp_without_default',
    desc: 'timestamp 类型的列必须添加默认值',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_varchar_max',
    desc: '禁止使用 varchar(max)',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_without_comment',
    desc: '列建议添加注释',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_without_default',
    desc: '除了自增列及大字段列之外，每个列都必须添加默认值',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_composite_index_max',
    desc: '复合索引的列数量不建议超过阈值',
    value: '3',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_database_suffix',
    desc: '数据库名称建议以"_DB"结尾',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_decimal_type_column',
    desc: '精确浮点数建议使用DECIMAL',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_index_column_with_blob',
    desc: '禁止将blob类型的列加入索引',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_index_count',
    desc: '索引个数建议不超过阈值',
    value: '5',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_index_option',
    desc: '建议选择可选性超过阈值字段作为索引',
    value: '0.7',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_index_prefix',
    desc: '普通索引必须要以"idx_"为前缀',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_indexes_exist_before_creat_constraints',
    desc: '建议创建约束前,先行创建索引',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_is_exist_limit_offset',
    desc: '使用LIMIT分页时,避免使用LIMIT M,N',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_object_name_length',
    desc: '表名、列名、索引名的长度不能大于64字节',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_object_name_using_cn',
    desc: '数据库对象命名禁止使用中文',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_object_name_using_keyword',
    desc: '数据库对象命名禁止使用关键字',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_name',
    desc: '建议主键命名为"PK_表名"',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_pk_not_exist',
    desc: '表必须有主键',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_prohibit_auto_increment',
    desc: '主键禁止使用自增',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_without_auto_increment',
    desc: '主键建议使用自增',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_without_bigint_unsigned',
    desc: '主键建议使用 bigint 无符号类型，即 bigint unsigned',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_table_partition',
    desc: '不建议使用分区表相关功能',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_table_without_comment',
    desc: '表建议添加注释',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_table_without_if_not_exists',
    desc: '新建表必须加入if not exists create，保证重复执行不报错',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_table_without_innodb_utf8mb4',
    desc: '建议使用Innodb引擎,utf8mb4字符集',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_transaction_isolation_level',
    desc: '事物隔离级别建议设置成RC',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_unique_index',
    desc: 'unique索引名必须使用 IDX_UK_表名_字段名',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_unique_index_prefix',
    desc: 'unique索引必须要以"uniq_"为前缀',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_disable_drop_statement',
    desc: '禁止除索引外的drop操作',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_disable_fk',
    desc: '禁止使用外键',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_osc_min_size',
    desc: '改表时，表空间超过指定大小(MB)审核时输出osc改写建议',
    value: '16',
    level: 'normal',
  },
  {
    rule_name: 'dml_check_batch_insert_lists_max',
    desc: '单条insert语句，建议批量插入不超过阈值',
    value: '5000',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_fuzzy_search',
    desc: '禁止使用全模糊搜索或左模糊搜索',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'dml_check_insert_columns_exist',
    desc: 'insert 语句必须指定column',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'dml_check_is_after_union_distinct',
    desc: '建议使用UNION ALL,替代UNION',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_limit_must_exist',
    desc: 'delete/update 语句必须有limit条件',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'dml_check_needless_func',
    desc: '避免使用不必要的内置函数',
    value: 'sha(),sqrt(),md5()',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_number_of_join_tables',
    desc: '使用JOIN连接表查询建议不超过阈值',
    value: '3',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_select_for_update',
    desc: '建议避免使用select for update',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_where_exist_func',
    desc: '避免对条件字段使用函数操作',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_where_exist_implicit_conversion',
    desc: '条件字段存在数值和字符的隐式转换',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_where_exist_not',
    desc: '不建议对条件字段使用负向查询',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_where_exist_null',
    desc: '不建议对条件字段使用 NULL 值判断',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_where_exist_scalar_sub_queries',
    desc: '避免使用标量子查询',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_with_limit',
    desc: 'delete/update 语句不能有limit条件',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'dml_check_with_order_by',
    desc: 'delete/update 语句不能有order by',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'dml_disable_select_all_column',
    desc: '不建议使用select *',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_rollback_max_rows',
    desc: '在 DML 语句中预计影响行数超过指定值则不回滚',
    value: '1000',
    level: 'notice',
  },
];

export const instanceRule = [
  {
    rule_name: 'all_check_where_is_invalid',
    desc: '禁止使用没有where条件的sql语句或者使用where 1=1等变相没有条件的sql',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_alter_table_need_merge',
    desc: '存在多条对同一个表的修改语句，建议合并成一个ALTER语句',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_collation_database',
    desc: '建议使用规定的数据库排序规则',
    value: 'utf8mb4_0900_ai_ci',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_blob_default_is_not_null',
    desc: 'BLOB 和 TEXT 类型的字段不可指定非 NULL 的默认值',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_blob_notice',
    desc: '不建议使用 BLOB 或 TEXT 类型',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_blob_with_not_null',
    desc: 'BLOB 和 TEXT 类型的字段不建议设置为 NOT NULL',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_char_length',
    desc: 'char长度大于20时，必须使用varchar类型',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_enum_notice',
    desc: '不建议使用 ENUM 类型',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_set_notice',
    desc: '不建议使用 SET 类型',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_timestamp_without_default',
    desc: 'timestamp 类型的列必须添加默认值',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_varchar_max',
    desc: '禁止使用 varchar(max)',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_column_without_comment',
    desc: '列建议添加注释',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_column_without_default',
    desc: '除了自增列及大字段列之外，每个列都必须添加默认值',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_composite_index_max',
    desc: '复合索引的列数量不建议超过阈值',
    value: '3',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_database_suffix',
    desc: '数据库名称建议以"_DB"结尾',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_decimal_type_column',
    desc: '精确浮点数建议使用DECIMAL',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_index_column_with_blob',
    desc: '禁止将blob类型的列加入索引',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_index_count',
    desc: '索引个数建议不超过阈值',
    value: '5',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_index_option',
    desc: '建议选择可选性超过阈值字段作为索引',
    value: '0.7',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_index_prefix',
    desc: '普通索引必须要以"idx_"为前缀',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_indexes_exist_before_creat_constraints',
    desc: '建议创建约束前,先行创建索引',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_is_exist_limit_offset',
    desc: '使用LIMIT分页时,避免使用LIMIT M,N',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_object_name_length',
    desc: '表名、列名、索引名的长度不能大于64字节',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_object_name_using_cn',
    desc: '数据库对象命名禁止使用中文',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_object_name_using_keyword',
    desc: '数据库对象命名禁止使用关键字',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_name',
    desc: '建议主键命名为"PK_表名"',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_pk_not_exist',
    desc: '表必须有主键',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_prohibit_auto_increment',
    desc: '主键禁止使用自增',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_without_auto_increment',
    desc: '主键建议使用自增',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_pk_without_bigint_unsigned',
    desc: '主键建议使用 bigint 无符号类型，即 bigint unsigned',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_table_partition',
    desc: '不建议使用分区表相关功能',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_table_without_comment',
    desc: '表建议添加注释',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_table_without_if_not_exists',
    desc: '新建表必须加入if not exists create，保证重复执行不报错',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_table_without_innodb_utf8mb4',
    desc: '建议使用Innodb引擎,utf8mb4字符集',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_transaction_isolation_level',
    desc: '事物隔离级别建议设置成RC',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'ddl_check_unique_index',
    desc: 'unique索引名必须使用 IDX_UK_表名_字段名',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_check_unique_index_prefix',
    desc: 'unique索引必须要以"uniq_"为前缀',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_disable_drop_statement',
    desc: '禁止除索引外的drop操作',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_disable_fk',
    desc: '禁止使用外键',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'ddl_osc_min_size',
    desc: '改表时，表空间超过指定大小(MB)审核时输出osc改写建议',
    value: '16',
    level: 'normal',
  },
  {
    rule_name: 'dml_check_batch_insert_lists_max',
    desc: '单条insert语句，建议批量插入不超过阈值',
    value: '5000',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_fuzzy_search',
    desc: '禁止使用全模糊搜索或左模糊搜索',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'dml_check_insert_columns_exist',
    desc: 'insert 语句必须指定column',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'dml_check_is_after_union_distinct',
    desc: '建议使用UNION ALL,替代UNION',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_limit_must_exist',
    desc: 'delete/update 语句必须有limit条件',
    value: '',
    level: 'error',
  },
  {
    rule_name: 'dml_check_needless_func',
    desc: '避免使用不必要的内置函数',
    value: 'sha(),sqrt(),md5()',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_number_of_join_tables',
    desc: '使用JOIN连接表查询建议不超过阈值',
    value: '3',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_select_for_update',
    desc: '建议避免使用select for update',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_where_exist_func',
    desc: '避免对条件字段使用函数操作',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_where_exist_implicit_conversion',
    desc: '条件字段存在数值和字符的隐式转换',
    value: '',
    level: 'notice',
  },
  {
    rule_name: 'dml_check_where_exist_not',
    desc: '不建议对条件字段使用负向查询',
    value: '',
    level: 'notice',
  },
];
