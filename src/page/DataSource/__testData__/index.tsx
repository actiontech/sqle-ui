export const dataSourceList = [
  {
    instance_name: 'db1',
    db_host: '20.20.20.2',
    db_port: '3306',
    db_user: 'root',
    desc: '',
    workflow_template_name: 'default',
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
