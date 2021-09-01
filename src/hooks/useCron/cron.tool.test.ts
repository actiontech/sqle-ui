import {
  checkCron,
  checkCronItem,
  checkNumber,
  CronErrorMessage,
  CronItemType,
  getLimitNumberByCronType,
  isNumberString,
  parseToCronItemFromNumber,
  parseToNumberFromCronItem,
} from './cron.tool';

describe('cron tool method', () => {
  test('should return range of time', () => {
    expect(getLimitNumberByCronType(CronItemType.Minute)).toEqual([0, 59]);
    expect(getLimitNumberByCronType(CronItemType.Hour)).toEqual([0, 23]);
    expect(getLimitNumberByCronType(CronItemType.Day)).toEqual([1, 31]);
    expect(getLimitNumberByCronType(CronItemType.Month)).toEqual([1, 12]);
    expect(getLimitNumberByCronType(CronItemType.Week)).toEqual([0, 6]);
    expect(getLimitNumberByCronType('a' as any)).toEqual([0, 0]);
  });

  test('should check a string only includes numbers', () => {
    expect(isNumberString('1')).toBe(true);
    expect(isNumberString('12')).toBe(true);
    expect(isNumberString('134')).toBe(true);
    expect(isNumberString('12')).toBe(true);
    expect(isNumberString('11241241241421323123123123123123123123123123')).toBe(
      true
    );
    expect(isNumberString('1.1')).toBe(false);
    expect(isNumberString('-1.1')).toBe(false);
    expect(isNumberString('-1')).toBe(false);
    expect(isNumberString('1a1')).toBe(false);
    expect(isNumberString('aaa')).toBe(false);
    expect(isNumberString('')).toBe(false);
  });

  test('should check a cron item is valid', () => {
    expect(checkCronItem('*', CronItemType.Day)).toBe('');
    expect(checkCronItem('1,2,3', CronItemType.Day)).toBe('');
    expect(checkCronItem('1-3', CronItemType.Day)).toBe('');
    expect(checkCronItem('1-9/2', CronItemType.Day)).toBe('');
    expect(checkCronItem('*/2', CronItemType.Day)).toBe('');
    expect(checkCronItem('1-59', CronItemType.Minute)).toBe('');

    expect(checkCronItem('a', CronItemType.Day)).toBe(
      CronErrorMessage.onlyHaveValidChar
    );
    expect(checkCronItem('1-99/2', CronItemType.Day)).toBe(
      CronErrorMessage.limit
    );
    expect(checkCronItem('1-59', CronItemType.Day)).toBe(
      CronErrorMessage.limit
    );
    expect(checkCronItem('1-/2', CronItemType.Day)).toBe(
      CronErrorMessage.invalid
    );
    expect(checkCronItem('-2/2', CronItemType.Day)).toBe(
      CronErrorMessage.invalid
    );
    expect(checkCronItem('1,2,3/2', CronItemType.Day)).toBe(
      CronErrorMessage.invalid
    );
  });

  test('should check cron expression is valid', () => {
    expect(checkCron('* * * * *')).toBe('');
    expect(checkCron('1 1 1 1 1')).toBe('');
    expect(checkCron('1-10/3 1,2,3 1-4 1,2,3-5 */2')).toBe('');

    expect(checkCron(123 as any)).toBe(CronErrorMessage.mustBeString);
    expect(checkCron('* * * * * *')).toBe(CronErrorMessage.lenMustBeFive);
    expect(checkCron('* * * * ')).toBe(CronErrorMessage.lenMustBeFive);
  });

  test('should parse cron item to number array', () => {
    expect(parseToNumberFromCronItem('1', CronItemType.Day)).toEqual([1]);
    expect(parseToNumberFromCronItem('1-5', CronItemType.Day)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(parseToNumberFromCronItem('1-6/2', CronItemType.Day)).toEqual([
      1, 3, 5,
    ]);
    expect(parseToNumberFromCronItem('*', CronItemType.Day)).toEqual([]);
    expect(parseToNumberFromCronItem('1,2,3,4,5', CronItemType.Day)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(parseToNumberFromCronItem('1,2,3,4,5-10', CronItemType.Day)).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    );
  });

  test('should check number can parse to cron item', () => {
    expect(checkNumber([1, 2, 3, 4, 5, 6, 7, 8, 9], CronItemType.Day)).toBe('');

    expect(
      checkNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 222], CronItemType.Day)
    ).toBe(CronErrorMessage.limit);

    expect(checkNumber('a' as any, CronItemType.Day)).toBe(
      CronErrorMessage.mustBeArray
    );
  });

  test('should parse to cron item from number array', () => {
    expect(parseToCronItemFromNumber([], CronItemType.Day)).toBe('*');
    expect(parseToCronItemFromNumber([1], CronItemType.Day)).toBe('1');
    expect(parseToCronItemFromNumber([1, 2], CronItemType.Day)).toBe('1,2');
    expect(parseToCronItemFromNumber([1, 2, 3], CronItemType.Day)).toBe('1-3');
    expect(
      parseToCronItemFromNumber([0, 1, 2, 3, 4, 5, 6], CronItemType.Week)
    ).toBe('*');
    expect(
      parseToCronItemFromNumber([1, 3, 5, 7, 9, 11, 13], CronItemType.Day)
    ).toBe('1-13/2');
    expect(
      parseToCronItemFromNumber([1, 2, 3, 4, 5, 6, 7], CronItemType.Day)
    ).toBe('1-7');
    expect(
      parseToCronItemFromNumber([1, 2, 3, 5, 6, 7], CronItemType.Day)
    ).toBe('1-3,5-7');
  });
});
