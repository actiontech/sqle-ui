import { IMethodTemplateParams, IClassTemplateParams } from './index.d';
import CommonData from '../common/Data';

class Template {
  public interfaceTemplate(name: string, body: string, extendsName?: string) {
    return `
      export interface ${name} ${extendsName ? `extends ${extendsName} ` : ''}${
      body.trim().startsWith('{')
        ? body
        : `{
        ${body}
      }`
    }
    `;
  }

  public typeTemplate(name: string, body: string) {
    return `
      export type ${name} = ${body}
    `;
  }

  public methodTemplate({
    methodName,
    paramsInterface,
    url,
    requestMethod,
    paramsMap,
    returnInterface,
    consumes,
  }: IMethodTemplateParams) {
    let paramsHandle = '';
    let currentUrl = url;
    let formDataParams = '';
    let headerParams = '';
    let pathParamsDeleteCode = '';
    if (currentUrl.includes('{')) {
      const urlArray = currentUrl.split('/');
      for (let i = 0; i < urlArray.length; i++) {
        if (urlArray[i].startsWith('{')) {
          const paramsName = urlArray[i].slice(1, -1);
          urlArray[i] = `$${urlArray[i]}`;
          pathParamsDeleteCode += `
            const ${paramsName} = paramsData.${paramsName};
            delete paramsData.${paramsName};
          `;
        }
      }
      currentUrl = urlArray.join('/');
    }
    for (let [key, value] of paramsMap) {
      switch (value) {
        case 'header':
          headerParams += `
        ${key}: params.${key},
          `;
          break;
        case 'formData':
          const paramsKeyStr = `params${
            key.includes('-') ? `['${key}']` : `.${key}`
          }`;
          formDataParams += `
            if (${paramsKeyStr} != undefined) {
              paramsData.append('${key}', ${paramsKeyStr} as any);
            }
          `;
          break;
      }
    }

    if (formDataParams && consumes.includes('multipart/form-data')) {
      formDataParams = `
        const paramsData = new FormData();
        ${formDataParams}
      `;
      headerParams += `
        'Content-Type': 'multipart/form-data'
      `;
    } else {
      formDataParams = '';
    }

    if (headerParams) {
      headerParams = `
        const config = options || {};
        const headers = config.headers ? config.headers : {};
        config.headers = {
          ...headers,
          ${headerParams}
        }; 
      `;
    }

    return `
      public ${methodName}(${
      paramsInterface ? `params: ${paramsInterface}, ` : ''
    }options?: AxiosRequestConfig) {
        ${headerParams ? headerParams : ''}
        ${
          formDataParams
            ? formDataParams
            : paramsInterface
            ? 'const paramsData = this.cloneDeep(params);'
            : ''
        }${!formDataParams && paramsInterface ? pathParamsDeleteCode : ''}
        return this.${requestMethod}${
      returnInterface ? `<${returnInterface}>` : ''
    }(${currentUrl.includes('$') ? '`' : "'"}${currentUrl}${
      currentUrl.includes('$') ? '`' : "'"
    }, ${paramsInterface ? 'paramsData' : 'undefined'}, ${
      headerParams ? 'config' : 'options'
    });
      }
    `;
  }

  public classTemplate({ className, body, importList }: IClassTemplateParams) {
    let importListStr = '';
    for (let [key, value] of importList) {
      importListStr += `
        import {
          ${value.map((value, i) => `${i > 0 ? ' ' : ''}${value},`).join('\n')}
        } from '${CommonData.transformImportKey(key)}'
      `;
    }

    return `
      /* tslint:disable no-identical-functions */
      /* tslint:disable no-useless-cast */
      /* tslint:disable no-unnecessary-type-assertion */
      /* tslint:disable no-big-function  */
      /* tslint:disable no-duplicate-string  */
      import ServiceBase from '../Service.base';
      import { AxiosRequestConfig } from 'axios';
      ${importListStr}

      class ${className}Service extends ServiceBase {
      ${body}
      }

      export default new ${className}Service();
    `;
  }

  public enumTemplate({ enumName, body }) {
    return `
      export enum ${enumName} {
        ${body}
      }
    `;
  }

  public serviceBaseTemplate() {
    return `
    import { AxiosRequestConfig } from 'axios';
    import { cloneDeep } from 'lodash';
    import ApiBase from '../utils/Api';

    class ServiceBase {
      protected get<T>(url: string, data: any = {}, options?: AxiosRequestConfig) {
        return ApiBase.get<T>(url, {
          params: data,
          ...options,
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
          params: data,
          ...options,
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
    `;
  }
}

export default new Template();
