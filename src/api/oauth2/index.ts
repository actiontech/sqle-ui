/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import { IBindOauth2UserParams, IBindOauth2UserReturn } from './index.d';

class Oauth2Service extends ServiceBase {
  public Oauth2Link(options?: AxiosRequestConfig) {
    return this.get('/v1/oauth2/link', undefined, options);
  }

  public bindOauth2User(
    params: IBindOauth2UserParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IBindOauth2UserReturn>(
      '/v1/oauth2/user/bind',
      paramsData,
      options
    );
  }
}

export default new Oauth2Service();
