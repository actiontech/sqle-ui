import moment from 'moment';

export const emailValidate = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
};

export const formatTime = (timeString?: string, defaultVal = ''): string => {
  if (!timeString) {
    return defaultVal;
  }
  return moment(timeString).format('YYYY-MM-DD HH:mm:ss');
};

export function translateTimeForRequest(time: undefined): undefined;
export function translateTimeForRequest(time: moment.Moment): string;
export function translateTimeForRequest(
  time: moment.Moment | undefined
): string | undefined;
export function translateTimeForRequest(
  time?: moment.Moment
): string | undefined {
  if (!time) {
    return;
  }
  return time.format('YYYY-MM-DDTHH:mm:ssZ');
}

export const getFileFromUploadChangeEvent = (e: any) => {
  if (e.file && e.file.status !== 'removed') {
    return [e.file];
  }
  return [];
};
