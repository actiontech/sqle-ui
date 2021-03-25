
export interface ISwaggerJson {
  consumes: string[];
  produces: string[];
  schemes: string[],
  swagger: string,
  info: {
    title: string,
    version: string
  },
  paths: ISwaggerPaths;
  definitions: ISwaggerDefinitions;
  parameters: {
    [key: string]: ISwaggerParameters
  };
}

export interface ISwaggerDefinitions {
  [key: string]: {
    type: string;
    required?: string[];
    enum?: string[];
    additionalProperties?: ISwaggerProps,
    item?: ISwaggerProps,
    properties: {
      [key: string]: ISwaggerProps
    }
  }
}

export interface ISwaggerProps {
  type: string;
  $ref?: string;
  enum?: string[];
  additionalProperties?: ISwaggerProps;
  properties?: {
    [key: string]: ISwaggerProps;
  };
  items?: ISwaggerProps;
}

export interface ISwaggerPaths {
  [key: string]: {
    [key in 'get' | 'post' | 'head' | 'put' | 'delete' | 'connect' | 'options' | 'trace']: {
      description: string;
      consumes: string[];
      tags: string[];
      operationId: string,
      parameters: ISwaggerParameters[];
      responses: {
        "200"?: {
          description: string,
          schema: ISwaggerProps;
        },
        default?: {
          description: string,
          schema: {
            $ref: string
          }
        }
      }
    }
  }
}

export interface ISwaggerParameters {
  type: string;
  description: string;
  name: string;
  in: string;
  required?: boolean;
  enum?: string[];
  $ref: string;
  schema: {
    type: string;
    required?: string[];
    properties?: {
      [key: string]: ISwaggerProps;
    }
    items?: ISwaggerProps;
    enum?: string[];
    $ref?: string;
  };
  items?: ISwaggerProps
}

