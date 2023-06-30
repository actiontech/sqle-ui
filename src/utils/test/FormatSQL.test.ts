import { formatterSQL, isSupportLanguage } from '../FormatterSQL';

describe('test FormatSQL', () => {
  test('isSupportLanguage', () => {
    expect(isSupportLanguage('MySQL')).toBeTruthy();
    expect(isSupportLanguage('DB2')).toBeTruthy();
    expect(isSupportLanguage('OceanBase For MySQL')).toBeTruthy();
    expect(isSupportLanguage('Oracle')).toBeTruthy();
    expect(isSupportLanguage('PostgreSQL')).toBeTruthy();
    expect(isSupportLanguage('SQL Server')).toBeTruthy();
    expect(isSupportLanguage('TiDB')).toBeFalsy();
  });

  test('should match snapshot', () => {
    expect(formatterSQL('select * from user', 'MySQL')).toMatchSnapshot();

    expect(
      formatterSQL('select GROUP_CONCAT(a) from t', 'MySQL')
    ).toMatchSnapshot();

    expect(
      formatterSQL('select GROUP_CONCAT(a) from t', 'DB2')
    ).toMatchSnapshot();
  });
});
