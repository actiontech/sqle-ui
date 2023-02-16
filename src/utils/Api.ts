import axios from 'axios';
import store from '../store';
import {
  updateBindProjects,
  updateManagementPermissions,
  updateToken,
  updateUser,
} from '../store/user';
import { ResponseCode, SQLE_REDIRECT_KEY_PARAMS_NAME } from '../data/common';
import { notification } from 'antd';
import i18n from '../locale';
import Download from './Download';

const ApiBase = axios.create();

export const authInvalid = () => {
  const targetUrl = window.location.pathname;
  if (targetUrl === '/login') {
    return;
  }

  window.location.href = `/login?${SQLE_REDIRECT_KEY_PARAMS_NAME}=${targetUrl}`;
  store.dispatch(updateUser({ username: '', role: '' }));
  store.dispatch(updateManagementPermissions({ managementPermissions: [] }));
  store.dispatch(updateBindProjects({ bindProjects: [] }));
  store.dispatch(updateToken({ token: '' }));
};

ApiBase.interceptors.response.use(
  (res) => {
    if (res.status === 401) {
      authInvalid();
    } else if (res.headers?.['content-disposition']?.includes('attachment')) {
      const disposition: string = res.headers?.['content-disposition'];
      const flag = 'filename=';
      const flagCharset = 'filename*=';
      let filename = '';
      if (disposition.includes(flagCharset)) {
        const tempArr = disposition.split("'");
        filename = decodeURI(tempArr[tempArr.length - 1]);
      } else {
        const startIndex = disposition.indexOf(flag);
        filename = disposition.slice(startIndex + flag.length);
      }
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
      const response = error?.response;
      notification.error({
        message: i18n.t('common.request.noticeFailTitle'),
        description:
          response?.data?.message ??
          response?.statusText ??
          i18n.t('common.unknownError'),
      });
    }
    return Promise.reject(error);
  }
);

export default ApiBase;
