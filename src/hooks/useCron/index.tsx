import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../types/common.type';
import {
  checkCron,
  checkNumber,
  CronItemType,
  parseToCronItemFromNumber,
  parseToNumberFromCronItem,
} from './cron.tool';
import { CronOptions } from './index.type';

const useCron = (options?: CronOptions) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(options?.defaultValue ?? '');
  const [error, setError] = useState('');

  const [Month, setMonth] = useState<number[]>([]);
  const [Day, setDay] = useState<number[]>([]);
  const [Week, setWeek] = useState<number[]>([]);
  const [Hour, setHour] = useState<number[]>([]);
  const [Minute, setMinute] = useState<number[]>([]);

  const updateCron = (cron: string) => {
    const error = checkCron(cron);
    if (error !== '') {
      setError(t(error) as string);
      setValue(cron);
    } else {
      setError('');
      setValue(cron);
      updateValueByCronChange(cron);
    }
  };

  const updateValueByCronChange = (cron: string) => {
    const [minute, hour, day, month, week] = cron.split(' ');
    setMonth(parseToNumberFromCronItem(month, CronItemType.Month));
    setDay(parseToNumberFromCronItem(day, CronItemType.Day));
    setWeek(parseToNumberFromCronItem(week, CronItemType.Week));
    setHour(parseToNumberFromCronItem(hour, CronItemType.Hour));
    setMinute(parseToNumberFromCronItem(minute, CronItemType.Minute));
  };

  const updateError = (errorMessage: I18nKey | ''): boolean => {
    if (errorMessage !== '') {
      setError(t(errorMessage) as string);
      return false;
    }
    if (error !== '') {
      setError('');
    }
    return true;
  };

  const updateMinute = (minutes: number[]) => {
    minutes.sort((a, b) => a - b);
    const tempError = checkNumber(minutes, CronItemType.Minute);
    if (updateError(tempError)) {
      setMinute(minutes);
      updateCronByNumber(minutes, Hour, Day, Month, Week);
    }
  };

  const updateHour = (hours: number[]) => {
    hours.sort((a, b) => a - b);
    const tempError = checkNumber(hours, CronItemType.Hour);
    if (updateError(tempError)) {
      setHour(hours);
      updateCronByNumber(Minute, hours, Day, Month, Week);
    }
  };

  const updateDay = (days: number[]) => {
    days.sort((a, b) => a - b);
    const tempError = checkNumber(days, CronItemType.Day);
    if (updateError(tempError)) {
      setDay(days);
      updateCronByNumber(Minute, Hour, days, Month, Week);
    }
  };

  const updateMonth = (months: number[]) => {
    months.sort((a, b) => a - b);
    const tempError = checkNumber(months, CronItemType.Month);
    if (updateError(tempError)) {
      setMonth(months);
      updateCronByNumber(Minute, Hour, Day, months, Week);
    }
  };

  const updateWeek = (weeks: number[]) => {
    weeks.sort((a, b) => a - b);
    const tempError = checkNumber(weeks, CronItemType.Week);
    if (updateError(tempError)) {
      setWeek(weeks);
      updateCronByNumber(Minute, Hour, Day, Month, weeks);
    }
  };

  const updateCronByNumber = (
    minute: number[],
    hour: number[],
    day: number[],
    month: number[],
    week: number[]
  ) => {
    const cronStr = `${parseToCronItemFromNumber(
      minute,
      CronItemType.Minute
    )} ${parseToCronItemFromNumber(
      hour,
      CronItemType.Hour
    )} ${parseToCronItemFromNumber(
      day,
      CronItemType.Day
    )} ${parseToCronItemFromNumber(
      month,
      CronItemType.Month
    )} ${parseToCronItemFromNumber(week, CronItemType.Week)}`;
    setValue(cronStr);
  };

  useEffect(() => {
    if (!!options?.defaultValue) {
      updateValueByCronChange(options?.defaultValue);
    } else {
      updateCron('* * * * *');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    value,
    error,
    month: Month,
    day: Day,
    week: Week,
    hour: Hour,
    minute: Minute,
    updateCron,
    updateMinute,
    updateHour,
    updateDay,
    updateMonth,
    updateWeek,
  };
};

export default useCron;
