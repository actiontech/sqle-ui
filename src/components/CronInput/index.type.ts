export enum CronMode {
  Manual = 'Manual',
  Select = 'Select',
}

export type CronInputProps = {
  everyDefault?: 'year' | 'month' | 'day' | 'week' | 'hour' | 'minute';
  value?: string;
  onChange?: (value: string) => void;
  mode?: CronMode;
  updateErrorMessage?: (errorMessage: string) => void;
};
