import { Select, Input } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCron from '../../hooks/useCron';
import { CronRange } from '../../hooks/useCron/cron.tool';
import { everyStatic, everyStaticLabel } from './index.data';
import './index.less';
import { CronInputProps, CronMode } from './index.type';

const CronInput: React.FC<CronInputProps> = (props) => {
  const {
    value,
    error,
    minute,
    hour,
    day,
    month,
    week,
    updateCron,
    updateMinute,
    updateHour,
    updateDay,
    updateMonth,
    updateWeek,
  } = useCron();

  const { t } = useTranslation();

  const [every, setEvery] = useState<string>(props.everyDefault ?? 'day');
  const mode = useMemo<CronMode>(() => {
    return props.mode ? props.mode : CronMode.Select;
  }, [props.mode]);

  const handleEveryChange = (nextEvery: string) => {
    if (error !== '') {
      updateCron('* * * * *');
      return;
    }
    const temp = value.split(' ');
    const tempIndex = [3, 2, 4, 1, 0];
    for (let i = 0; i < everyStatic[nextEvery]; i++) {
      temp[tempIndex[i]] = '*';
    }
    setEvery(nextEvery);
    updateCron(temp.join(' '));
  };

  useEffect(() => {
    if (props.updateErrorMessage) {
      props.updateErrorMessage(error);
    }
  }, [error, props]);

  useEffect(() => {
    if (!!props.value && props.value !== value) {
      updateCron(props.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  useEffect(() => {
    console.log(111, props.onChange, props.value, value);
    if (props.onChange) {
      props.onChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="cron-input-wrapper">
      <div className="cron-user-select" hidden={mode === CronMode.Manual}>
        {t('common.time.per')}
        <Select
          value={every}
          onChange={handleEveryChange}
          className="cron-every-select"
          placeholder={t('common.form.placeholder.select')}
        >
          {Object.keys(everyStatic).map((item) => (
            <Select.Option value={item} key={item}>
              {t(everyStaticLabel[item])}
            </Select.Option>
          ))}
        </Select>
        <span hidden={everyStatic[every] !== 0}>
          {t('common.in')}
          <Select
            onChange={updateMonth}
            value={month}
            mode="multiple"
            style={{ width: '100%' }}
            dropdownClassName="cron-inline-select-dropdown"
            className="cron-inline-select"
            virtual={false}
            placeholder={t('common.time.month')}
            dropdownMatchSelectWidth={false}
            maxTagCount={1}
            maxTagPlaceholder="..."
            allowClear
          >
            {CronRange.month.map((item) => (
              <Select.Option
                value={item}
                key={item}
                className="cron-inline-select-option"
              >
                {item}
              </Select.Option>
            ))}
          </Select>
          {t('common.time.month')}
        </span>
        <span hidden={everyStatic[every] > 1}>
          {t('common.on')}
          <Select
            onChange={updateDay}
            value={day}
            mode="multiple"
            style={{ width: '100%' }}
            dropdownClassName="cron-inline-select-dropdown"
            className="cron-inline-select"
            placeholder={t('common.time.day')}
            maxTagCount={1}
            dropdownMatchSelectWidth={false}
            maxTagPlaceholder="..."
            virtual={false}
            allowClear
          >
            {CronRange.day.map((item) => (
              <Select.Option
                value={item}
                key={item}
                className="cron-inline-select-option"
              >
                {item}
              </Select.Option>
            ))}
          </Select>
          {t('common.time.no')}
        </span>
        <span hidden={everyStatic[every] > 2}>
          {t('common.and')}
          {t('common.time.week')}
          <Select
            onChange={updateWeek}
            value={week}
            mode="multiple"
            style={{ width: '100%' }}
            dropdownClassName="cron-inline-select-dropdown"
            className="cron-inline-select"
            placeholder={t('common.time.week')}
            maxTagCount={1}
            dropdownMatchSelectWidth={false}
            maxTagPlaceholder="..."
            virtual={false}
            allowClear
          >
            {CronRange.week.map((item) => (
              <Select.Option
                value={item}
                key={item}
                className="cron-inline-select-option"
              >
                {item}
              </Select.Option>
            ))}
          </Select>
        </span>
        <span hidden={everyStatic[every] > 3}>
          {t('common.on')}
          <Select
            onChange={updateHour}
            value={hour}
            mode="multiple"
            style={{ width: '100%' }}
            dropdownClassName="cron-inline-select-dropdown"
            maxTagCount={1}
            className="cron-inline-select"
            placeholder={t('common.time.hour')}
            dropdownMatchSelectWidth={false}
            maxTagPlaceholder="..."
            virtual={false}
            allowClear
          >
            {CronRange.hour.map((item) => (
              <Select.Option
                value={item}
                key={item}
                className="cron-inline-select-option"
              >
                {item}
              </Select.Option>
            ))}
          </Select>
          :
        </span>
        {everyStatic[every] === 4 && t('common.on')}
        <span hidden={everyStatic[every] > 4}>
          <Select
            onChange={updateMinute}
            value={minute}
            mode="multiple"
            style={{ width: '100%' }}
            dropdownClassName="cron-inline-select-dropdown"
            maxTagCount={1}
            className="cron-inline-select"
            placeholder={t('common.time.minute')}
            virtual={false}
            dropdownMatchSelectWidth={false}
            maxTagPlaceholder="..."
            allowClear
          >
            {CronRange.minute.map((item) => (
              <Select.Option
                value={item}
                key={item}
                className="cron-inline-select-option"
              >
                {item}
              </Select.Option>
            ))}
          </Select>
        </span>

        <div>
          {t('common.preview')}: {value}
        </div>
      </div>
      <div className="cron-user-manual" hidden={mode === CronMode.Select}>
        <Input onChange={(e) => updateCron(e.target.value)} value={value} />
      </div>
    </div>
  );
};

export default CronInput;
