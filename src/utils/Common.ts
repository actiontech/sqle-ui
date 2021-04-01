import moment from 'moment';

export const emailValidate = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
};

export const formatTime = (timeString?: string, defaultVal = ''): string => {
  if (!timeString) {
    return defaultVal;
  }
  return moment(timeString).format('YYYY-MM-DD HH:mm:ss');
};
