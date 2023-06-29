import { format } from 'sql-formatter';

export enum FormatLanguageSupport {
  MySQL = 'mysql',
  DB2 = 'db2',
  'SQL Server' = 'tsql',
  'OceanBase For MySQL' = 'mysql',
  'Oracle' = 'plsql',
  'PostgreSQL' = 'postgresql',
}

export const isSupportLanguage = (type?: string) => {
  return Object.keys(FormatLanguageSupport).some((key) => {
    return key === type;
  });
};

export const formatterSQL = (sql: string, type?: string) => {
  let language = 'sql';
  Object.keys(FormatLanguageSupport).forEach((v) => {
    const key = v as keyof typeof FormatLanguageSupport;
    if (key === type) {
      language = FormatLanguageSupport[key];
    }
  });
  return format(sql, {
    language,
  });
};
