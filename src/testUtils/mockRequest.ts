import { AxiosResponse } from 'axios';

export const successData = (data: any) => {
  return {
    code: 0,
    message: '',
    data,
  };
};

export const failedData = (data?: any) => {
  return {
    code: 100,
    message: 'error',
    data,
  };
};

export const resolveImmediately = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return Promise.resolve({
    status,
    headers,
    config,
    statusText,
    data: successData(data),
  });
};

export const rejectImmediately = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return Promise.reject({
    status,
    headers,
    config,
    statusText,
    data: failedData(data),
  });
};

export const resolveThreeSecond = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        data: successData(data),
      });
    }, 3000);
  });
};

export const resolveErrorThreeSecond = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        data: failedData(data),
      });
    }, 3000);
  });
};

export const rejectThreeSecond = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((_, rej) => {
    setTimeout(() => {
      rej({
        status,
        headers,
        config,
        statusText,
        data: failedData(data),
      });
    }, 3000);
  });
};

export const throwErrorThreeSecond = (
  error = 'error',
  { status = 500, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise((res) => {
    throw new Error(error);
  });
};
