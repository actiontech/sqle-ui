export interface SqlSearchHistoryProps {
  visible: boolean;
  applyHistorySql: (sql: string) => void;
  close: () => void;
  instanceName: string;
}

export type FilterSqlHistoryFormFields = {
  sql_history_filter: string;
};
