import { IInstanceResV2 } from '../../../api/common';

export const dataSourceList: IInstanceResV2[] = [
  {
    instance_name: 'db1',
    db_host: '20.20.20.2',
    db_port: '3306',
    db_user: 'root',
    db_type: 'mysql',
    desc: '',
    rule_template: { is_global_rule_template: true, name: 'default' },
    maintenance_times: [
      {
        maintenance_start_time: {
          hour: 23,
          minute: 0,
        },
        maintenance_stop_time: {
          hour: 23,
          minute: 30,
        },
      },
      {
        maintenance_start_time: {
          hour: 0,
          minute: 0,
        },
        maintenance_stop_time: {
          hour: 2,
          minute: 0,
        },
      },
    ],
    source: 'SQLE',
  },
  {
    instance_name: 'db2',
    db_host: '20.20.20.1',
    db_port: '3306',
    db_user: 'root',
    db_type: 'mysql',
    desc: '',
    rule_template: { is_global_rule_template: false, name: 'test' },
    maintenance_times: [],
    source: 'DMP',
  },
];

export const dataSourceInstance = {
  instance_name: 'db1',
  db_host: '20.20.20.2',
  db_port: '3306',
  db_user: 'root',
  db_type: 'mysql',
  desc: '',
  workflow_template_name: 'workflow-template-name-1',
};

export const dataSourceMetas = [
  {
    db_type: 'mysql',
    params: [
      { description: '字段a', name: 'a', type: 'string', value: '123' },
      { description: '字段b', name: 'b', type: 'int', value: '123' },
      { description: '字段c', name: 'c', type: 'bool', value: 'true' },
    ],
  },
  {
    db_type: 'oracle',
    params: [
      { description: '字段e', name: 'e', type: 'string', value: '2222' },
      { description: '字段f', name: 'f', type: 'int', value: '333' },
      { description: '字段mm', name: 'mm', type: 'bool', value: 'false' },
    ],
  },
];
