import { useBoolean } from 'ahooks';
import {
  Button,
  Col,
  DatePicker,
  Popover,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MaintenanceTimePickerProps, MaintenanceTimeValue } from '.';
import EmptyBox from '../../../../components/EmptyBox';

import { Moment } from 'moment';

import './MaintenanceTimePicker.less';

const MaintenanceTimePicker: React.FC<MaintenanceTimePickerProps> = (props) => {
  const { value = [], onChange } = props;

  const [
    popoverVisible,
    { toggle: popoverVisibleChange, setFalse: closePopover },
  ] = useBoolean();

  const { t } = useTranslation();

  const [range, setRange] = useState<[Moment | null, Moment | null] | null>();

  const turnMomentToMaintenanceTime = (
    startMoment: Moment,
    endMoment: Moment
  ): MaintenanceTimeValue => {
    return {
      startTime: {
        hour: startMoment.hour(),
        minute: startMoment.minute(),
      },
      endTime: {
        hour: endMoment.hour(),
        minute: endMoment.minute(),
      },
    };
  };

  const add = () => {
    if (range && range[0] && range[1]) {
      onChange?.([...value, turnMomentToMaintenanceTime(range[0], range[1])]);
    }
    closePopover();
    setRange(null);
  };

  const deleteTime = (index: number) => {
    onChange?.([...value.slice(0, index), ...value.slice(index + 1)]);
  };

  const addZero = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <Space className="full-width-element">
      <EmptyBox
        if={value.length > 0}
        defaultNode={
          <Typography.Text type="secondary">
            {t('common.maintenanceTimePicker.placeholder')}
          </Typography.Text>
        }
      >
        {value.map((v, index) => (
          <Tag closable onClose={() => deleteTime(index)}>
            {addZero(v.startTime.hour)}:{addZero(v.startTime.minute)} -
            {addZero(v.endTime.hour)}:{addZero(v.endTime.minute)}
          </Tag>
        ))}
      </EmptyBox>
      <Popover
        visible={popoverVisible}
        onVisibleChange={popoverVisibleChange}
        content={
          <Row className="maintenance-time-picker-popover-wrapper">
            <Col
              span={6}
              className="maintenance-time-picker-label flex-all-center"
            >
              {t('common.maintenanceTimePicker.range')}
            </Col>
            <Col span={18}>
              <DatePicker.RangePicker
                picker="time"
                format="HH:mm"
                value={range}
                onChange={setRange}
              />
            </Col>
            <Col span={24} className="maintenance-time-picker-btn-wrapper">
              <Button size="small" type="primary" onClick={add}>
                {t('common.ok')}
              </Button>
            </Col>
          </Row>
        }
        trigger="click"
      >
        <Button>{t('common.add')}</Button>
      </Popover>
    </Space>
  );
};

export default MaintenanceTimePicker;
