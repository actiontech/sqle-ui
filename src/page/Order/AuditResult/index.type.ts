export type AuditResultProps = {
  taskId?: number;
  passRate?: number;
  auditScore?: number;

  updateTaskRecordTotalNum?: (num: number) => void;
};
