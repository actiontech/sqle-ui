import { FormInstance } from 'antd';

export type BaseInfoFormFields = {
  tags: string[];
};

export type BaseInfoFormProps = {
  form: FormInstance<BaseInfoFormFields>;
  projectName: string;
};

export type BaseInfoFormRef = {
  reset: () => void;
};

export type SQLInfoFormRef = {
  reset: () => void;
};

export type SQLInfoFormFields = {
  auditType: AuditTypeEnum;
  uploadType: UploadTypeEnum;
  sql: string;
  sqlFile: File[];
  mybatisFile: File[];
  zipFile: File[];
  instanceName: string;
  instanceSchema: string;
  dbType: string;
};

export type SQLInfoFormProps = {
  form: FormInstance<SQLInfoFormFields>;
  submit: (values: SQLInfoFormFields) => Promise<void>;
  projectName: string;
};

export enum AuditTypeEnum {
  static,
  dynamic,
}

export enum UploadTypeEnum {
  sql,
  sqlFile,
  xmlFile,
  zipFile,
}
