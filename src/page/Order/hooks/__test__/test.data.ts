import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '../../../../api/common.enum';
import { SqlInfoFormFields } from '../../Create/SqlInfoForm/index.type';
import { SqlStatementFields } from '../../SqlStatementFormTabs';

export const sameSqlValues: SqlInfoFormFields = {
  '0': {
    sql: 'SELECT (1)',
    sqlInputType: 0,
  } as SqlStatementFields,
  dataBaseInfo: [
    { instanceName: 'mysql-1', instanceSchema: 'db1' },
    { instanceName: 'mysql-2', instanceSchema: 'db2' },
    { instanceName: 'mysql-3', instanceSchema: 'db3' },
  ],
  isSameSqlOrder: true,
};

export const differenceSqlValues: SqlInfoFormFields = {
  '0': {
    sql: 'SELECT (1)',
    sqlInputType: 0,
  } as SqlStatementFields,
  '2': {
    sql: 'SELECT (2)',
    sqlInputType: 0,
  } as SqlStatementFields,
  '3': {
    sql: 'SELECT (3)',
    sqlInputType: 0,
  } as SqlStatementFields,
  dataBaseInfo: [
    { instanceName: 'mysql-1', instanceSchema: 'db1' },
    { instanceName: 'mysql-2', instanceSchema: 'db2' },
    { instanceName: 'mysql-3', instanceSchema: 'db3' },
  ],
  isSameSqlOrder: true,
};

export const taskInfosLeverIsError = [
  {
    instanceName: 'test1',
    currentAuditLevel:
      WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error,
  },
  {
    instanceName: 'test2',
    currentAuditLevel:
      WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal,
  },
];

export const taskInfosLeverIsNormal = [
  {
    instanceName: 'test3',
    currentAuditLevel:
      WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal,
  },
  {
    instanceName: 'test4',
    currentAuditLevel:
      WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal,
  },
];
