import MaintenanceTimePicker from './MaintenanceTimePicker';

export type MaintenanceTimeValue = {
  startTime: {
    hour: number;
    minute: number;
  };
  endTime: {
    hour: number;
    minute: number;
  };
};

export type MaintenanceTimePickerProps = {
  value?: MaintenanceTimeValue[];
  onChange?: (values: MaintenanceTimeValue[]) => void;
};

export default MaintenanceTimePicker;
