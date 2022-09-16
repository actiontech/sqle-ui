import { useBoolean } from 'ahooks';
import { Button, DatePicker, Form, Modal, Space, Tag } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { range } from 'lodash';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../../../components/EmptyBox';
import { ModalFormLayout } from '../../../data/common';
import { timeAddZero } from '../../../utils/Common';
import { ScheduleTimeModalProps } from './index.type';

const ScheduleTimeModal: React.FC<ScheduleTimeModalProps> = ({
  visible,
  closeScheduleModal,
  maintenanceTime = [],
  submit,
}) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [
    scheduleLoading,
    { setTrue: scheduleStart, setFalse: scheduleFinish },
  ] = useBoolean();

  const resetAndCloseScheduleModal = () => {
    form.resetFields();
    closeScheduleModal();
  };

  const disabledDate = (current: moment.Moment) => {
    return current && current <= moment().startOf('day');
  };
  const disabledDateTime = (value: moment.MomentInput) => {
    const current = moment(value);
    const isToday =
      moment(value).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');

    let allHours = range(0, 24);
    if (maintenanceTime.length > 0) {
      maintenanceTime.forEach((item) => {
        const start = item.maintenance_start_time?.hour ?? 0;
        const end = item.maintenance_stop_time?.hour ?? 0;
        for (let i = start; i <= end; i++) {
          allHours[i] = -1;
        }
      });
    }
    if (maintenanceTime.length === 0 && !!value) {
      allHours = allHours.fill(-1);
    }

    if (isToday) {
      range(0, moment().hour()).forEach((item, i) => {
        allHours[item] = i;
      });
    }
    allHours = allHours.reduce<number[]>((sum, prev) => {
      if (prev === -1) {
        return sum;
      }
      return [...sum, prev];
    }, []);

    let allMinutes: Set<number> = new Set();
    const hour = current.hour();
    if (!Number.isNaN(hour)) {
      if (maintenanceTime.length > 0) {
        maintenanceTime.forEach((item) => {
          const startHour = item.maintenance_start_time?.hour ?? 0;
          const startMinute = item.maintenance_start_time?.minute ?? 0;
          const endHour = item.maintenance_stop_time?.hour ?? 0;
          const endMinute = item.maintenance_stop_time?.minute ?? 0;
          if (startHour === endHour && startHour === hour) {
            range(startMinute, endMinute).forEach((item) => {
              allMinutes.add(item);
            });
          } else if (hour === startHour) {
            range(startMinute, 60).forEach((item) => {
              allMinutes.add(item);
            });
          } else if (hour === endHour) {
            range(0, endMinute).forEach((item) => {
              allMinutes.add(item);
            });
          }
          if (hour > startHour && hour < endHour) {
            range(0, 60).forEach((item) => {
              allMinutes.add(item);
            });
          }
        });
      } else {
        range(0, 60).forEach((item) => {
          allMinutes.add(item);
        });
      }
    }

    if (isToday && hour === moment().hour()) {
      range(0, moment().minute()).forEach((item) => {
        allMinutes.delete(item);
      });
    }
    const disabledMinutes = range(0, 60).filter(
      (item) => !allMinutes.has(item)
    );
    return {
      disabledHours: () => allHours,
      disabledMinutes: () => disabledMinutes,
    };
  };
  const checkTimeInMaintenanceTime = (time: moment.Moment) => {
    const hour = time.hour();
    const minute = time.minute();

    if (maintenanceTime.length === 0) {
      return true;
    }

    for (const time of maintenanceTime) {
      const startHour = time.maintenance_start_time?.hour ?? 0;
      const startMinute = time.maintenance_start_time?.minute ?? 0;
      const endHour = time.maintenance_stop_time?.hour ?? 0;
      const endMinute = time.maintenance_stop_time?.minute ?? 0;
      if (startHour === endHour && startHour === hour) {
        if (minute >= startMinute && minute <= endMinute) {
          return true;
        }
      }
      if (hour === startHour) {
        if (minute >= startMinute) {
          return true;
        }
      }
      if (hour === endHour) {
        if (minute <= endMinute) {
          return true;
        }
      }
      if (hour > startHour && hour < endHour) {
        return true;
      }
    }
    return false;
  };
  const createDefaultRangeTime = () => {
    if (maintenanceTime.length === 0) {
      return moment('00:00:00', 'HH:mm:ss');
    }
    const hour = maintenanceTime[0].maintenance_start_time?.hour ?? 0;
    const minute = maintenanceTime[0].maintenance_start_time?.minute ?? 0;
    return moment(`${timeAddZero(hour)}:${timeAddZero(minute)}:00`, 'HH:mm:ss');
  };

  const scheduleTimeHandle = async () => {
    const values = await form.validateFields();
    if (!values?.schedule_time) {
      return;
    }
    scheduleStart();
    submit(
      values?.schedule_time?.format('YYYY-MM-DDTHH:mm:ssZ')?.toString()
    ).finally(() => {
      scheduleFinish();
      resetAndCloseScheduleModal();
    });
  };
  return (
    <Modal
      title={t('order.operator.onlineRegularly')}
      visible={visible}
      closable={false}
      footer={null}
    >
      <Form {...ModalFormLayout} form={form}>
        <Form.Item
          label={t('order.operator.scheduleTime')}
          name="schedule_time"
          validateFirst
          rules={[
            {
              required: true,
            },
            {
              validator(_, rule: moment.Moment) {
                if (rule.isBefore(moment())) {
                  return Promise.reject(
                    t('order.operator.execScheduledBeforeNow')
                  );
                }

                if (checkTimeInMaintenanceTime(rule)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  t('order.operator.execScheduledErrorMessage')
                );
              },
            },
          ]}
        >
          <DatePicker
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{
              defaultValue: createDefaultRangeTime(),
            }}
            showNow={false}
            data-testid="start-date"
          />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          {t('order.operator.maintenanceTime')}:
          <EmptyBox
            if={maintenanceTime.length > 0}
            defaultNode={t('order.operator.emptyMaintenanceTime')}
          >
            {maintenanceTime.map((time, i) => (
              <Tag key={i}>
                {timeAddZero(time.maintenance_start_time?.hour ?? 0)}:{' '}
                {timeAddZero(time.maintenance_start_time?.minute ?? 0)}-
                {timeAddZero(time.maintenance_stop_time?.hour ?? 0)}:{' '}
                {timeAddZero(time.maintenance_stop_time?.minute ?? 0)}
              </Tag>
            ))}
          </EmptyBox>
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Space>
            <Button
              type="primary"
              onClick={scheduleTimeHandle}
              loading={scheduleLoading}
              data-testid="confirm-button"
            >
              {t('order.operator.onlineRegularly')}
            </Button>
            <Button onClick={resetAndCloseScheduleModal}>
              {t('common.cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleTimeModal;
