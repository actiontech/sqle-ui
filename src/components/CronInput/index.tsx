import { Select, Input, Radio, RadioChangeEvent, Space, Checkbox } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCron from '../../hooks/useCron';
import { CronRange } from '../../hooks/useCron/cron.tool';
import { weekLabel } from './index.data';
import './index.less';
import { CronInputProps, CronMode, CronTimeValue } from './index.type';

const CronInput: React.FC<CronInputProps> = (props) => {
  const {
    value,
    error,
    week,
    minute,
    hour,
    updateCron,
    updateMinute,
    updateHour,
    updateWeek,
  } = useCron({ defaultValue: props.value });

  const { t } = useTranslation();
  const [cronMode, setCronMode] = useState<CronMode>(CronMode.Select);

  const [every, setEvery] = useState<CronTimeValue>(
    props.everyDefault ?? CronTimeValue.everyDay
  );
  const mode = useMemo<CronMode>(() => {
    if (props.mode !== undefined) {
      return props.mode;
    }
    return cronMode;
  }, [props.mode, cronMode]);

  const handleEveryChange = (nextEvery: CronTimeValue) => {
    if (nextEvery === CronTimeValue.everyDay) {
      updateWeek([]);
    }
    setEvery(nextEvery);
  };

  const updateCronMode = (mode: CronMode) => {
    if (props.mode !== undefined) {
      props.modeChange?.(mode);
    } else {
      setCronMode(mode);
    }
  };

  const handleCronModeChange = (e: RadioChangeEvent) => {
    const tempMode = e.target.value;
    updateCronMode(tempMode);
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
    if (props.onChange) {
      props.onChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const simpleEnable = useMemo(() => {
    const [, , _day, _month] = value.split(' ');
    return _day === '*' && _month === '*';
  }, [value]);

  useEffect(() => {
    if (!error && !simpleEnable && value && mode === CronMode.Select) {
      updateCronMode(CronMode.Manual);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, simpleEnable, value]);

  useEffect(() => {
    if (
      every === CronTimeValue.everyDay &&
      week.length !== 0 &&
      week.length !== 7
    ) {
      setEvery(CronTimeValue.everyWeek);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className="cron-input-wrapper">
      <div style={{ lineHeight: '32px' }}>
        <Radio.Group value={cronMode} onChange={handleCronModeChange}>
          <Radio disabled={!simpleEnable} value={CronMode.Select}>
            {t('common.cron.mode.select')}
          </Radio>
          <Radio value={CronMode.Manual}>{t('common.cron.mode.manual')}</Radio>
        </Radio.Group>
      </div>
      <div className="cron-user-select" hidden={mode === CronMode.Manual}>
        <Space direction="vertical" className="full-width-element">
          <Space>
            <span>{t('common.cron.label.interval')}:</span>
            <Select
              className="cron-every-select"
              onChange={handleEveryChange}
              value={every}
              placeholder={t('common.form.placeholder.select')}
            >
              <Select.Option value={CronTimeValue.everyDay}>
                {t('common.cron.time.everyDay')}
              </Select.Option>
              <Select.Option value={CronTimeValue.everyWeek}>
                {t('common.cron.time.everyWeek')}
              </Select.Option>
            </Select>
          </Space>
          <Space
            className="cron-week-wrapper"
            hidden={every === CronTimeValue.everyDay}
          >
            <Checkbox.Group
              value={week}
              onChange={(checkedValue) => updateWeek(checkedValue as number[])}
            >
              {CronRange.week.map((item) => (
                <Checkbox value={item} key={item}>
                  {t(weekLabel[item])}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Space>
          <Space className="full-width-element">
            <span>{t('common.cron.label.point')}:</span>
            <Select
              onChange={updateHour}
              value={hour}
              mode="multiple"
              dropdownClassName="cron-inline-select-dropdown"
              maxTagCount={3}
              className="cron-inline-select"
              placeholder={`${t('common.time.per')}${t('common.time.hour')}`}
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
            <Select
              onChange={updateMinute}
              value={minute}
              mode="multiple"
              dropdownClassName="cron-inline-select-dropdown"
              maxTagCount={3}
              className="cron-inline-select"
              placeholder={`${t('common.time.per')}${t('common.time.minute')}`}
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
          </Space>
        </Space>
        <div data-testid="cron-preview">
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
