import { IMaintenanceTimeResV1 } from '../../../../api/common';

export const checkTimeInWithMaintenanceTime = (
  time: moment.Moment,
  maintenanceTime: IMaintenanceTimeResV1[]
) => {
  const hour = time.hour();
  const minute = time.minute();

  if (maintenanceTime.length === 0) {
    return true;
  }

  for (const v of maintenanceTime) {
    const startHour = v.maintenance_start_time?.hour ?? 0;
    const startMinute = v.maintenance_start_time?.minute ?? 0;
    const endHour = v.maintenance_stop_time?.hour ?? 0;
    const endMinute = v.maintenance_stop_time?.minute ?? 0;
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
};
