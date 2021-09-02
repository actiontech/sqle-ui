import { isString } from 'lodash';
import { I18nKey } from '../../types/common.type';

export const CronErrorMessage: { [key: string]: I18nKey } = {
  invalid: 'common.cron.errorMessage.invalid',
  mustBeString: 'common.cron.errorMessage.mustBeString',
  mustBeArray: 'common.cron.errorMessage.mustBeArray',
  lenMustBeFive: 'common.cron.errorMessage.lenMustBeFive',
  onlyHaveValidChar: 'common.cron.errorMessage.onlyHaveValidChar',
  limit: 'common.cron.errorMessage.limit',
};

export enum CronItemType {
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Month = 'month',
  Week = 'week',
}

export const CronRange = {
  minute: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
    59,
  ],
  hour: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ],
  day: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ],
  month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  week: [0, 1, 2, 3, 4, 5, 6],
};

export const getLimitNumberByCronType = (
  type: CronItemType
): [number, number] => {
  switch (type) {
    case CronItemType.Minute:
      return [0, 59];
    case CronItemType.Hour:
      return [0, 23];
    case CronItemType.Day:
      return [1, 31];
    case CronItemType.Month:
      return [1, 12];
    case CronItemType.Week:
      return [0, 6];
    default:
      return [0, 0];
  }
};

export const isNumberString = (val: string) => {
  return /^[\d]+$/.test(val);
};

export const checkCronItem = (
  cronItemString: string,
  itemType: CronItemType
): I18nKey | '' => {
  if (cronItemString === '*') {
    return '';
  }
  if (!/^[-,/\d*]+$/.test(cronItemString)) {
    return CronErrorMessage.onlyHaveValidChar;
  }
  const [min, max] = getLimitNumberByCronType(itemType);
  if (cronItemString.includes(',')) {
    let error: I18nKey | '' = '';
    const crons = cronItemString.split(',');
    for (const cron of crons) {
      if (cron === '') {
        return CronErrorMessage.invalid;
      }
      error = checkCronItem(cron, itemType);
      if (error !== '') {
        return error;
      }
    }
    return '';
  }
  if (cronItemString.includes('/')) {
    const [leftValue, rightValue] = cronItemString.split('/');
    if (leftValue !== '*' && !leftValue.includes('-')) {
      return CronErrorMessage.invalid;
    }
    if (leftValue.includes('-')) {
      return checkCronItem(leftValue, itemType);
    }
    if (!isNumberString(rightValue)) {
      return CronErrorMessage.invalid;
    }
    return '';
  }
  if (cronItemString.includes('-')) {
    let [minVal, maxVal] = cronItemString.split('-');
    if (!isNumberString(minVal) || !isNumberString(maxVal)) {
      return CronErrorMessage.invalid;
    }
    const minNum = Number.parseInt(minVal, 10);
    const maxNum = Number.parseInt(maxVal, 10);
    if (minNum >= maxNum) {
      return CronErrorMessage.invalid;
    }
    if (minNum < min || maxNum > max) {
      return CronErrorMessage.limit;
    }
    return '';
  }
  if (!isNumberString(cronItemString)) {
    return CronErrorMessage.invalid;
  }
  const val = Number.parseInt(cronItemString, 10);
  if (val < min || val > max) {
    return CronErrorMessage.limit;
  }
  return '';
};

export const checkCron = (cronString: string): I18nKey | '' => {
  if (!isString(cronString)) {
    return CronErrorMessage.mustBeString;
  }
  const tempArray = cronString.trim().split(' ');
  if (tempArray.length !== 5) {
    return CronErrorMessage.lenMustBeFive;
  }
  const types = [
    CronItemType.Minute,
    CronItemType.Hour,
    CronItemType.Day,
    CronItemType.Month,
    CronItemType.Week,
  ];
  let error: I18nKey | '' = '';
  for (let i = 0; i < tempArray.length; i++) {
    error = checkCronItem(tempArray[i], types[i]);
    if (error !== '') {
      return error;
    }
  }
  return error;
};

export const parseToNumberFromCronItem = (
  cronItem: string,
  itemType: CronItemType
): number[] => {
  if (cronItem === '*') {
    return [];
  }
  if (cronItem.includes(',')) {
    const tempArray = cronItem.split(',');
    return tempArray.reduce<number[]>((sum, current) => {
      sum.push(...parseToNumberFromCronItem(current, itemType));
      return sum;
    }, []);
  }
  const res: number[] = [];
  if (cronItem.includes('/')) {
    const [leftValue, rightValue] = cronItem.split('/');
    let min = 0,
      max = 0;
    if (leftValue === '*') {
      [min, max] = getLimitNumberByCronType(itemType);
    } else if (leftValue.includes('-')) {
      const [minStr, maxStr] = leftValue.split('-');
      min = Number.parseInt(minStr, 10);
      max = Number.parseInt(maxStr, 10);
    }
    const step = Number.parseInt(rightValue, 10);
    let currentStep = step;
    for (let i = min; i <= max; i++) {
      if (currentStep === step) {
        res.push(i);
        currentStep = 1;
      } else {
        currentStep++;
      }
    }
    return res;
  }
  if (cronItem.includes('-')) {
    const [leftValue, rightValue] = cronItem.split('-');
    const start = Number.parseInt(leftValue, 10);
    const end = Number.parseInt(rightValue, 10);
    for (let i = start; i <= end; i++) {
      res.push(i);
    }
    return res;
  }
  return [Number.parseInt(cronItem, 10)];
};

export const checkNumber = (
  number: number[],
  itemType: CronItemType
): '' | I18nKey => {
  const [min, max] = getLimitNumberByCronType(itemType);
  if (!Array.isArray(number)) {
    return CronErrorMessage.mustBeArray;
  }
  if (number.length === 0) {
    return '';
  }
  const pass = number.every((item) => item >= min && item <= max);
  if (!pass) {
    return CronErrorMessage.limit;
  }
  return '';
};

export const parseToCronItemFromNumber = (
  numbers: number[],
  itemType: CronItemType
): string => {
  const [min, max] = getLimitNumberByCronType(itemType);
  const numbersAfterSort = numbers.sort((a, b) => a - b);
  const startsWithMin = numbersAfterSort[0] === min;
  if (numbersAfterSort.length === 0) {
    return '*';
  }
  let res = `${numbersAfterSort[0]}`;
  if (numbersAfterSort.length === 1) {
    return res;
  }
  if (numbersAfterSort.length === 2) {
    return numbersAfterSort.join(',');
  }

  const step = numbersAfterSort[1] - numbersAfterSort[0];
  let isArithmeticSequence = true;
  for (let i = 1; i < numbersAfterSort.length; i++) {
    if (numbersAfterSort[i] - numbersAfterSort[i - 1] !== step) {
      isArithmeticSequence = false;
      break;
    }
  }
  if (isArithmeticSequence) {
    if (startsWithMin) {
      const all = [];
      let currentStep = step;
      for (let i = min; i <= max; i++) {
        if (currentStep === step) {
          all.push(i);
          currentStep = 1;
        } else {
          currentStep = 0;
        }
      }
      if (
        all.length === numbersAfterSort.length &&
        all.every((item, index) => item === numbersAfterSort[index])
      ) {
        if (step === 1) {
          return '*';
        }
        return `*/${step}`;
      }
    }
    if (step === 1) {
      return `${numbersAfterSort[0]}-${
        numbersAfterSort[numbersAfterSort.length - 1]
      }`;
    }
    return `${numbersAfterSort[0]}-${
      numbersAfterSort[numbersAfterSort.length - 1]
    }/${step}`;
  }

  let prev = numbersAfterSort[0],
    start = numbersAfterSort[0];
  for (let i = 1; i < numbersAfterSort.length; i++) {
    if (numbersAfterSort[i] === numbersAfterSort[i - 1] + 1) {
      prev = numbersAfterSort[i];
      continue;
    }
    if (prev !== start) {
      res += `-${prev},${numbersAfterSort[i]}`;
      start = numbersAfterSort[i];
      prev = numbersAfterSort[i];
    } else {
      res += `,${numbersAfterSort[i]}`;
    }
  }
  if (prev !== start) {
    res += `-${prev}`;
  }
  return res;
};
