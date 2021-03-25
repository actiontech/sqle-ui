
export interface IMethodTemplateParams {
  methodName: string;
  paramsInterface: string;
  returnInterface: string;
  url: string;
  requestMethod: string;
  paramsMap: Map<string, 'body'| 'query'| 'path'| 'formData'| 'header'>;
  consumes: string[];
}

export interface IClassTemplateParams {
  className: string;
  body: string;
  importList: Map<string, string[]>;
}
