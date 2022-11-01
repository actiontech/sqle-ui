/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IGetManagementPermissionsV1Return } from './index.d';

class ManagementPermissionService extends ServiceBase {
  public GetManagementPermissionsV1(options?: AxiosRequestConfig) {
    return this.get<IGetManagementPermissionsV1Return>(
      '/v1/management_permissions',
      undefined,
      options
    );
  }
}

export default new ManagementPermissionService();
