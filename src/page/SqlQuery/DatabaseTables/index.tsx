import DatabaseTables from './DatabaseTables';

export type DatabaseTablesProps = {
  dataSourceName?: string;
  schemaName?: string;

  getTableSchema: (tableName: string) => Promise<void>;
};

export default DatabaseTables;
