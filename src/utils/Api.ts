import axios from 'axios';
import store from '../store';
import { updateToken, updateUser } from '../store/user';
import { createBrowserHistory } from 'history';
import { ResponseCode } from '../data/common';
import { notification } from 'antd';
import i18n from '../locale';
import Download from './Download';

const ApiBase = axios.create();

const authInvalid = () => {
  store.dispatch(updateUser({ username: '', role: '' }));
  store.dispatch(updateToken({ token: '' }));
  const history = createBrowserHistory();
  history.push('/login');
};

ApiBase.interceptors.response.use(
  (res) => {
    if (res.status === 401) {
      authInvalid();
    } else if (res.headers?.['content-disposition']?.includes('attachment')) {
      const disposition: string = res.headers?.['content-disposition'];
      const flag = 'filename=';
      const startIndex = disposition.indexOf(flag);
      const filename = disposition.slice(startIndex + flag.length);
      Download.downloadByCreateElementA(res.data, filename);
      return res;
    } else if (
      (res.status === 200 && res?.data?.code !== ResponseCode.SUCCESS) ||
      res.status !== 200
    ) {
      notification.error({
        message: i18n.t('common.request.noticeFailTitle'),
        description: res?.data?.message ?? i18n.t('common.unknownError'),
      });
    }
    return res;
  },
  (error) => {
    if (error?.response?.status === 401) {
      authInvalid();
    } else if (error?.response?.status !== 200) {
      notification.error({
        message: i18n.t('common.request.noticeFailTitle'),
        description:
          error?.response?.statusText ?? i18n.t('common.unknownError'),
      });
    }
    return Promise.reject(error);
  }
);

const doNotAddAuthRequest = ['/login'];

ApiBase.interceptors.request.use((config) => {
  if (doNotAddAuthRequest.some((url) => config.url?.includes(url))) {
    return config;
  }
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: store.getState().user.token,
    },
  };
});

export default ApiBase;
