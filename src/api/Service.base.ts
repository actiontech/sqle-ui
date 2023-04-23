import { AxiosRequestConfig } from 'axios';
import { cloneDeep } from 'lodash';
import ApiBase from '../utils/Api';

class ServiceBase {
  protected get<T>(url: string, data: any = {}, options?: AxiosRequestConfig) {
    return ApiBase.get<T>(url, {
      params: data,
      ...options
    });
  }

  protected post<T>(url: string, data: any = {}, options?: AxiosRequestConfig) {
    return ApiBase.post<T>(url, data, options);
  }

  protected delete<T>(
    url: string,
    data: any = {},
    options?: AxiosRequestConfig
  ) {
    return ApiBase.delete<T>(url, {
      data,
      ...options
    });
  }

  protected put<T>(url: string, data: any = {}, options?: AxiosRequestConfig) {
    return ApiBase.put<T>(url, data, options);
  }

  protected patch<T>(
    url: string,
    data: any = {},
    options?: AxiosRequestConfig
  ) {
    return ApiBase.patch<T>(url, data, options);
  }

  protected cloneDeep(data: any = {}) {
    return cloneDeep(data);
  }
}

export default ServiceBase;
