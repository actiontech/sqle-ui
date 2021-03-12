import axios from 'axios';
import store from '../store';
import { updateUser } from '../store/user';
import { createBrowserHistory } from 'history';
import { ResponseCode } from '../data/common';
import { notification } from 'antd';
import i18n from '../locale';

const ApiBase = axios.create();

ApiBase.interceptors.response.use((res) => {
  if (res.status === 401) {
    store.dispatch(updateUser({ username: '', token: '', role: '' }));
    const history = createBrowserHistory();
    history.push('/login');
  } else if (res.status === 200 && res?.data?.code !== ResponseCode.SUCCESS) {
    notification.error({
      message: i18n.t('common.request.noticeFailTitle'),
      description: res?.data?.message ?? i18n.t('common.unknownError'),
    });
  }
  return res;
});

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
