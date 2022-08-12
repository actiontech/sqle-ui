export const random = (min: number, max: number): number => {
  return Math.random() * (max - min + 1) + min;
};

export const floatRound = (num: number, bit = 2): number => {
  return Math.round(num * Math.pow(10, bit)) / Math.pow(10, bit);
};

export const floatToPercent = (num: number, bit = 2): number => {
  return floatRound(num * 100, bit);
};

export const minuteToHourMinute = (minutes: number): string => {
  if (minutes < 60) {
    return minutes + 'min';
  }
  return Math.floor(minutes / 60) + 'h' + (minutes % 60) + 'min';
};
