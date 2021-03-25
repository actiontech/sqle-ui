import * as path from 'path';
import Json from '../json';
import {
  ISwaggerPaths,
  ISwaggerParameters,
  ISwaggerDefinitions,
  ISwaggerProps,
} from '../json/index.d';
import CommonData from '../common/Data';
import template from '../template';
import write from '../write';
import { ITransformDefinitionsInterfaceReturn } from './core';
import BaseClass from '../common/BaseClass';

class Core extends BaseClass {
  private swaggerJsonSrc: string;
  private outputSrc: string;

  private typeDictionary = {
    integer: 'number',
    number: 'number',
    string: 'string',
    boolean: 'boolean',
    file: 'any',
  };

  private commonInterfaceBuffer = '';
  private commonInterfaceImport: Map<string, string[]> = new Map();
  private commonEnumBuffer = '';
  private commonInterfaceIsEnum: string[] = [];
  private commonInterfaceIsNormalType: Map<string, string> = new Map();
  private commonParamDefined: { [key: string]: ISwaggerParameters } = {};

  private interfaceBuffer = '';
  private interfaceImportList: Map<string, string[]> = new Map();
  private enumBuffer = '';
  private classImportList: Map<string, string[]> = new Map();

  constructor(
    swaggerJsonSrc: string,
    outputSrc: string = path.resolve(__dirname, '../api')
  ) {
    super();
    this.swaggerJsonSrc = swaggerJsonSrc;
    this.outputSrc = outputSrc;
  }

  public registerPlugin() {
    if (!process.argv.some((e) => e.startsWith('--plugin='))) {
      return;
    }
    let pluginPath = process.argv.find((e) => e.startsWith('--plugin='));
    pluginPath = pluginPath.replace('--plugin=', '');
    console.log(pluginPath);
    this.plugin.registerPlugin(pluginPath);
  }

  public generateApi() {
    console.time('generate success');
    this.registerPlugin();
    const apiData = Json.getApiData(this.swaggerJsonSrc);
    this.commonParamDefined = apiData.parameters;
    this.generateCommonInterface(apiData.definitions);
    write.writeFile(
      this.outputSrc + '/common.d.ts',
      this.commonInterfaceBuffer
    );
    if (this.commonEnumBuffer !== '') {
      write.writeFile(
        this.outputSrc + '/common.enum.ts',
        this.commonEnumBuffer
      );
    }

    write.writeFile(
      this.outputSrc + '/Service.base.ts',
      template.serviceBaseTemplate()
    );
    for (const [key, value] of apiData.apiMap) {
      this.interfaceBuffer = '';
      this.interfaceImportList = new Map();
      this.enumBuffer = '';
      this.classImportList = new Map();
      const currentFile = `${this.outputSrc}/${key}`;
      const classBody = this.generateMethod(value);
      let className = CommonData.removeSpecialStr(key);
      const classFile = this.generateClass(className, classBody);
      write.writeFile(`${currentFile}/index.ts`, classFile);
      write.writeFile(`${currentFile}/index.d.ts`, this.interfaceBuffer);
      if (this.enumBuffer) {
        this.addSpecialContentInEnumFile();
        write.writeFile(`${currentFile}/index.enum.ts`, this.enumBuffer);
      }
    }
    console.timeEnd('generate success');
  }

  public generateMethod(methods: ISwaggerPaths[]) {
    let body = '';
    methods.forEach((method) => {
      Object.keys(method).forEach((url) => {
        Object.keys(method[url]).forEach((requestMethod) => {
          if (CommonData.RequestMethod.includes(requestMethod)) {
            const paramsMap = new Map();
            const currentParams: ISwaggerParameters[] =
              method[url][requestMethod].parameters || [];
            currentParams.forEach((param) => {
              paramsMap.set(param.name, param.in);
            });
            const operationId = method[url][requestMethod].operationId;
            const paramsInterface = this.getParamsInterface(
              currentParams,
              operationId
            );
            const returnInterface = this.getReturnInterface(
              method[url][requestMethod].responses[200].schema,
              operationId
            );
            body += template.methodTemplate({
              methodName: operationId,
              paramsInterface: paramsInterface,
              returnInterface: returnInterface,
              // returnInterface: '',
              url: url,
              requestMethod,
              paramsMap,
              consumes: method[url][requestMethod].consumes || [],
            });
            if (paramsInterface.endsWith('Params')) {
              this.addValue(this.classImportList, 'd', paramsInterface);
              this.generateParamsInterface(
                paramsInterface,
                method[url][requestMethod].parameters,
                operationId
              );
            }
            if (returnInterface.endsWith('Return')) {
              this.addValue(this.classImportList, 'd', returnInterface);
              this.generateReturnInterface(
                returnInterface,
                method[url][requestMethod].responses[200].schema,
                operationId
              );
            }
          }
        });
      });
    });
    let importListStr = '';
    for (let [key, value] of this.interfaceImportList) {
      importListStr += `
        import {
          ${value.map((value, i) => `${i > 0 ? '  ' : ''}${value},\n`).join('')}
        } from '${CommonData.transformImportKey(key)}'
      `;
    }
    this.interfaceBuffer = importListStr + this.interfaceBuffer;
    return body;
  }

  public getParamsInterface(
    params: ISwaggerParameters[],
    operationId: string
  ): string {
    let interfaceName = '';
    if (params.length === 0) {
      return interfaceName;
    } else if (
      params.length === 1 &&
      params[0].in === 'body' &&
      params[0].name == 'body'
    ) {
      const body = params[0];
      if (body.schema.type === 'array') {
        if (
          body.schema.items.type === 'object' &&
          (body.schema.items.properties ||
            body.schema.items.additionalProperties)
        ) {
          interfaceName = `${CommonData.removeSpecialStr(
            `I${CommonData.upperCaseFirstLetter(operationId)}Params`
          )}[]`;
        } else if (body.schema.items.$ref) {
          const {
            isEnum,
            isInterface,
            name,
            isNormal,
          } = this.transformDefinitionsInterface(body.schema.items.$ref);
          if (!isNormal) {
            this.addValue(
              this.classImportList,
              isEnum ? 'common.enum' : 'common.d',
              name
            );
          }
          interfaceName = `${name}[]`;
        } else {
          interfaceName = `${this.typeDictionary[body.schema.items.type]}[]`;
        }
      } else if (body.schema.type === 'object' || body.schema.$ref) {
        interfaceName = `${CommonData.removeSpecialStr(
          `I${CommonData.upperCaseFirstLetter(operationId)}`
        )}Params`;
      } else {
        interfaceName = body.schema.type;
      }
    } else {
      interfaceName = `${CommonData.removeSpecialStr(
        `I${CommonData.upperCaseFirstLetter(operationId)}`
      )}Params`;
    }
    return interfaceName;
  }

  public getReturnInterface(params: ISwaggerProps, operationId: string) {
    if (!params) {
      return '';
    }
    if (Object.keys(this.typeDictionary).includes(params.type)) {
      return this.typeDictionary[params.type];
    } else if (params.type === 'array') {
      return this.getTypeFromArray(
        params,
        this.classImportList,
        this.enumBuffer
      );
    } else if (params.$ref) {
      const {
        isEnum,
        isInterface,
        name,
        isNormal,
      } = this.transformDefinitionsInterface(params.$ref);
      if (isNormal || isEnum) {
        return name;
      } else {
        return `I${CommonData.upperCaseFirstLetter(operationId)}Return`;
      }
    } else if (params.type === 'object') {
      return `I${CommonData.upperCaseFirstLetter(operationId)}Return`;
    } else {
      console.log(params);
      throw new Error('core: getReturnInterface: invalid type...');
    }
  }

  public generateCommonInterface(definitions: ISwaggerDefinitions) {
    const specialKeys = Object.keys(definitions).filter((item) =>
      Object.keys(this.typeDictionary).includes(definitions[item].type)
    );
    const normalKeys = Object.keys(definitions).filter(
      (item) =>
        !Object.keys(this.typeDictionary).includes(definitions[item].type)
    );
    const keys = specialKeys.concat(normalKeys);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (Object.keys(this.typeDictionary).includes(definitions[key].type)) {
        if (definitions[key].enum && this.validEnum(definitions[key].enum)) {
          let enumName = CommonData.removeSpecialStr(
            `${key[0].toUpperCase()}${key.slice(1)}Enum`
          );
          let enumBody = this.generateEnum(definitions[key].enum);
          this.commonEnumBuffer += template.enumTemplate({
            enumName,
            body: enumBody,
          });
          this.addValue(this.commonInterfaceImport, 'common.enum', enumName);
          this.commonInterfaceIsEnum.push(key);
          continue;
        } else {
          this.commonInterfaceIsNormalType.set(key, definitions[key].type);
          continue;
        }
      }
      const currentInterfaceName = `I${key}`;
      const currentInterfaceRequired = definitions[key].required || [];
      let currentInterfaceBody = '';
      if (definitions[key].type === 'array') {
        currentInterfaceBody += this.getTypeFromArray(
          definitions[key],
          this.commonInterfaceImport,
          this.commonEnumBuffer,
          true
        );
        this.commonInterfaceBuffer += template.typeTemplate(
          currentInterfaceName,
          currentInterfaceBody
        );
        continue;
      }
      if (definitions[key].additionalProperties) {
        if (
          Object.keys(this.typeDictionary).includes(
            definitions[key].additionalProperties.type
          )
        ) {
          currentInterfaceBody += `
            [key: string]: ${
              this.typeDictionary[definitions[key].additionalProperties.type]
            }
          `;
        } else {
          currentInterfaceBody += `
            [key: string]: any
          `;
        }
      } else if (definitions[key].properties) {
        Object.keys(definitions[key].properties).forEach((prop) => {
          const currentProp = definitions[key].properties[prop];
          let enumName = '';
          const currentEnum =
            currentProp.enum || (currentProp.items && currentProp.items.enum);
          if (currentEnum && this.validEnum(currentEnum)) {
            enumName = CommonData.removeSpecialStr(
              `${key}${prop[0].toUpperCase()}${prop.slice(1)}Enum`
            );
            let enumBody = '';
            currentEnum.forEach((enumProp) => {
              enumBody += `
                '${enumProp ? enumProp : 'UNKNOWN'}' = '${enumProp}',
              `;
            });
            this.commonEnumBuffer += template.enumTemplate({
              enumName,
              body: enumBody,
            });
            this.addValue(this.commonInterfaceImport, 'common.enum', enumName);
          }
          if (Object.keys(this.typeDictionary).includes(currentProp.type)) {
            currentInterfaceBody += `
              '${prop}'${currentInterfaceRequired.includes(prop) ? '' : '?'}: ${
              enumName ? enumName : this.typeDictionary[currentProp.type]
            };
            `;
          } else if (currentProp.type === 'array') {
            currentInterfaceBody += `
              '${prop}'${
              currentInterfaceRequired.includes(prop) ? '' : '?'
            }: ${this.getTypeFromArray(
              currentProp,
              this.commonInterfaceImport,
              this.commonEnumBuffer,
              true
            )};
            `;
          } else if (currentProp.type === 'object' || currentProp.$ref) {
            currentInterfaceBody += `
              '${prop}'${
              currentInterfaceRequired.includes(prop) ? '' : '?'
            }: ${this.getTypeFromObject(
              currentProp,
              this.commonEnumBuffer,
              this.commonInterfaceImport,
              true
            )};
            `;
          } else {
            console.error(currentProp);
            throw new Error('Core: generateCommonInterface: invalid type');
          }
        });
      } else {
        console.log(definitions[key]);
        throw new Error('Core: generateCommonInterface: invalid type');
      }
      this.commonInterfaceBuffer += template.interfaceTemplate(
        currentInterfaceName,
        currentInterfaceBody
      );
    }
    let importListStr = '';
    for (let [key, value] of this.commonInterfaceImport) {
      if (key === 'common.d') {
        continue;
      }
      const path =
        key === 'common.enum'
          ? './common.enum'
          : CommonData.transformImportKey(key);
      importListStr += `
        import {
          ${value.map((value, i) => `${i > 0 ? '  ' : ''}${value},\n`).join('')}
        } from '${path}'
      `;
    }
    this.commonInterfaceBuffer = importListStr + this.commonInterfaceBuffer;
  }

  public generateParamsInterface(
    interfaceName: string,
    params: ISwaggerParameters[],
    operationId: string
  ) {
    let currentInterfaceBody = '';
    let interfaceExtends = '';
    params.forEach((currentParam) => {
      let param = currentParam;
      if (currentParam.$ref) {
        param = this.getParamsFormCommonParams(currentParam.$ref);
      }
      if (param.name === 'body' && param.in === 'body') {
        if (param.schema.$ref) {
          const {
            isEnum,
            isInterface,
            name,
            isNormal,
          } = this.transformDefinitionsInterface(param.schema.$ref);
          interfaceExtends = name;
          if (!isNormal) {
            this.addValue(
              this.interfaceImportList,
              isInterface ? 'common.d' : 'common.enum',
              interfaceExtends
            );
          }
        } else if (param.schema.properties) {
          const requiredProps = param.schema.required || [];
          Object.keys(param.schema.properties).forEach((prop) => {
            let enumName = '';
            const currentProp = param.schema.properties[prop];
            const currentEnum =
              currentProp.enum || (currentProp.items && currentProp.items.enum);
            if (currentEnum && this.validEnum(currentEnum)) {
              enumName = CommonData.removeSpecialStr(
                `${operationId}${prop[0].toUpperCase()}${prop.slice(1)}Enum`
              );
              const enumBody = this.generateEnum(currentEnum);
              this.enumBuffer += template.enumTemplate({
                enumName,
                body: enumBody,
              });
              this.addValue(this.interfaceImportList, 'enum', enumName);
            }
            if (Object.keys(this.typeDictionary).includes(currentProp.type)) {
              currentInterfaceBody += `
                '${prop}'${requiredProps.includes(prop) ? '' : '?'}: ${
                enumName ? enumName : this.typeDictionary[currentProp.type]
              };
              `;
            } else if (currentProp.type === 'array') {
              currentInterfaceBody += `
                '${prop}'${
                requiredProps.includes(prop) ? '' : '?'
              }: ${this.getTypeFromArray(
                currentProp,
                this.interfaceImportList,
                this.enumBuffer
              )};
              `;
            } else if (currentProp.type === 'object' || currentProp.$ref) {
              currentInterfaceBody += `
                '${prop}'${
                requiredProps.includes(prop) ? '' : '?'
              }: ${this.getTypeFromObject(
                currentProp,
                this.enumBuffer,
                this.interfaceImportList
              )};
              `;
            } else {
              console.log(currentProp);
              throw new Error('invalid prop type');
            }
          });
        }
      } else {
        let enumName = '';
        const currentEnum = param.enum;
        if (currentEnum && this.validEnum(currentEnum)) {
          enumName = CommonData.removeSpecialStr(
            `${operationId}${param.name[0].toUpperCase()}${param.name.slice(
              1
            )}Enum`
          );
          const enumBody = this.generateEnum(currentEnum);
          this.enumBuffer += template.enumTemplate({
            enumName,
            body: enumBody,
          });
          this.addValue(this.interfaceImportList, 'enum', enumName);
        }
        if (Object.keys(this.typeDictionary).includes(param.type)) {
          currentInterfaceBody += `
            '${param.name}'${param.required ? '' : '?'}: ${
            enumName ? enumName : this.typeDictionary[param.type]
          };
          `;
        } else if (param.type === 'array') {
          currentInterfaceBody += `
            '${param.name}'${
            param.required ? '' : '?'
          }: ${this.getTypeFromArray(
            param,
            this.interfaceImportList,
            this.enumBuffer
          )};
          `;
        } else if (param.schema && param.schema.$ref) {
          const {
            isEnum,
            isInterface,
            name,
            isNormal,
          } = this.transformDefinitionsInterface(param.schema.$ref);
          if (!isNormal) {
            this.addValue(
              this.interfaceImportList,
              isInterface ? 'common.d' : 'common.enum',
              name
            );
          }
          currentInterfaceBody += `
            '${param.name}'${param.required ? '' : '?'}: ${name};
          `;
        } else if (param.schema && param.schema.properties) {
          currentInterfaceBody += `
            '${param.name}'${
            param.required ? '' : '?'
          }: ${this.getTypeFromObject(
            param.schema,
            this.enumBuffer,
            this.interfaceImportList
          )};
          `;
        } else if (param.schema.type === 'array') {
          currentInterfaceBody += `
            '${param.name}'${
            param.required ? '' : '?'
          }: ${this.getTypeFromArray(
            param.schema,
            this.interfaceImportList,
            this.enumBuffer
          )};
          `;
        } else {
          console.log(param);
          throw new Error('to do...');
        }
      }
    });
    this.interfaceBuffer += template.interfaceTemplate(
      interfaceName,
      currentInterfaceBody,
      interfaceExtends
    );
  }

  public generateReturnInterface(
    interfaceName: string,
    param: ISwaggerProps,
    operationId: string
  ) {
    let currentInterfaceBody = '';
    let enumName = '';
    let interfaceExtends = '';
    const currentEnum = param.enum;
    if (currentEnum && this.validEnum(currentEnum)) {
      enumName = CommonData.removeSpecialStr(`${interfaceName}Enum`);
      const enumBody = this.generateEnum(currentEnum);
      this.enumBuffer += template.enumTemplate({ enumName, body: enumBody });
      this.addValue(this.interfaceImportList, 'enum', enumName);
    }
    if (param.$ref) {
      const {
        isEnum,
        isInterface,
        name,
        isNormal,
      } = this.transformDefinitionsInterface(param.$ref);
      if (!isNormal) {
        this.addValue(
          this.interfaceImportList,
          isInterface ? 'common.d' : 'common.enum',
          name
        );
      }
      interfaceExtends = name;
    } else if (param.type === 'object') {
      currentInterfaceBody += this.getTypeFromObject(
        param,
        this.enumBuffer,
        this.interfaceImportList
      );
    } else {
      throw new Error('core: generateReturnInterface: invalid type');
    }
    this.interfaceBuffer += template.interfaceTemplate(
      interfaceName,
      currentInterfaceBody,
      interfaceExtends
    );
  }

  public generateClass(key: string, classBody: string) {
    const className = `${key[0].toUpperCase()}${key.slice(1)}`;
    return template.classTemplate({
      className,
      body: classBody,
      importList: this.classImportList,
    });
  }

  public generateEnum(enums: string[]) {
    let enumBody = '';
    enums.forEach((enumProp) => {
      enumBody += `
        '${enumProp ? enumProp : 'UNKNOWN'}' = '${enumProp}',
      `;
    });
    return enumBody;
  }

  private traverseObject(
    props: { [key: string]: ISwaggerProps },
    enumBuffer: string,
    importList: Map<string, string[]>,
    required: string[] = [],
    isCommon: boolean
  ) {
    let body = '';
    Object.keys(props).forEach((prop, i) => {
      const currentProps = props[prop];
      let enumName = '';
      const currentEnum = currentProps.enum;
      if (currentEnum && this.validEnum(currentEnum)) {
        enumName = CommonData.removeSpecialStr(
          `${prop[0].toUpperCase()}${prop.slice(1)}Enum`
        );
        const enumBody = this.generateEnum(currentEnum);
        if (isCommon) {
          if (this.commonEnumBuffer.includes(enumName)) {
            enumName = '';
          } else {
            this.commonEnumBuffer += template.enumTemplate({
              enumName,
              body: enumBody,
            });
            this.addValue(
              importList,
              isCommon ? 'common.enum' : 'enum',
              enumName
            );
          }
        } else if (!this.enumBuffer.includes(`enum ${enumName}`)) {
          this.enumBuffer += template.enumTemplate({
            enumName,
            body: enumBody,
          });
          this.addValue(importList, 'enum', enumName);
        }
      }
      if (Object.keys(this.typeDictionary).includes(currentProps.type)) {
        body += `
          '${prop}'${required.includes(prop) ? '' : '?'}: ${
          enumName ? enumName : this.typeDictionary[currentProps.type]
        };
        `;
      } else if (currentProps.$ref) {
        const {
          isEnum,
          isInterface,
          name,
          isNormal,
        } = this.transformDefinitionsInterface(currentProps.$ref);
        if (!isNormal) {
          this.addValue(
            importList,
            isInterface ? 'common.d' : 'common.enum',
            name
          );
        }
        body += `
          '${prop}'${required.includes(prop) ? '' : '?'}: ${name}
        `;
      } else if (currentProps.type === 'object' && currentProps.properties) {
        body += `
          '${prop}'${required.includes(prop) ? '' : '?'}: {
            ${this.traverseObject(
              currentProps.properties,
              enumBuffer,
              importList,
              required,
              isCommon
            )}
          }
        `;
      } else if (
        currentProps.type === 'object' &&
        currentProps.additionalProperties
      ) {
        body += `
          '${prop}'${required.includes(prop) ? '' : '?'}: any
        `;
      } else if (currentProps.type === 'array') {
        body += `
          '${prop}'${
          required.includes(prop) ? '' : '?'
        }: ${this.getTypeFromArray(
          currentProps,
          importList,
          enumBuffer,
          isCommon
        )}
        `;
      }
    });
    return body;
  }

  private validEnum(enumArray: string[]) {
    for (let i = 0; i < enumArray.length; i++) {
      if (/^\d+$/.test(enumArray[i])) {
        console.warn(
          `Core: ValidEnum: invalid enum, typescript only support string type key in enum, but now find a number key, ${enumArray}`
        );
        return false;
      }
    }
    return true;
  }

  private transformDefinitionsInterface(
    ref: string
  ): ITransformDefinitionsInterfaceReturn {
    let refInterface = ref.split('/').pop();
    if (this.commonInterfaceIsEnum.includes(refInterface)) {
      return {
        isEnum: true,
        isInterface: false,
        isNormal: false,
        name: `${CommonData.upperCaseFirstLetter(refInterface)}Enum`,
      };
    }
    if (this.commonInterfaceIsNormalType.has(refInterface)) {
      return {
        isEnum: false,
        isInterface: false,
        isNormal: true,
        name: this.commonInterfaceIsNormalType.get(refInterface),
      };
    }
    refInterface = `I${CommonData.upperCaseFirstLetter(refInterface)}`;
    return {
      isEnum: false,
      isInterface: true,
      isNormal: false,
      name: refInterface,
    };
  }

  private getParamsFormCommonParams(path: string) {
    const key = path.split('/').pop();
    return this.commonParamDefined[key];
  }

  private getTypeFromArray(
    array: ISwaggerProps,
    interfaceImport: Map<string, string[]>,
    enumBuffer: string,
    isCommon: boolean = false
  ): string {
    if (Object.keys(this.typeDictionary).includes(array.items.type)) {
      return `${this.typeDictionary[array.items.type]}[]`;
    } else if (array.items.type === 'array') {
      return `${this.getTypeFromArray(
        array.items,
        interfaceImport,
        enumBuffer,
        isCommon
      )}[]`;
    } else if (array.items.$ref) {
      const {
        isEnum,
        isInterface,
        isNormal,
        name,
      } = this.transformDefinitionsInterface(array.items.$ref);
      if (!isNormal) {
        this.addValue(
          interfaceImport,
          isEnum ? 'common.enum' : 'common.d',
          name
        );
      }
      return `${name}[]`;
    } else if (array.items.type === 'object') {
      return `Array<${this.getTypeFromObject(
        array.items,
        enumBuffer,
        interfaceImport,
        isCommon
      )}>`;
    } else {
      console.log(array);
      throw new Error('Core: getTypeFromArray: to do...');
    }
  }

  private getTypeFromObject(
    props: ISwaggerProps,
    enumBuffer: string,
    interfaceImport: Map<string, string[]>,
    isCommon: boolean = false
  ): string {
    if (props.type !== 'object' && !props.$ref) {
      throw new Error(
        "Core: getTypeFromObject: props.type must be 'object' or has '$ref'"
      );
    }
    if (props.$ref) {
      const {
        isEnum,
        isInterface,
        name,
        isNormal,
      } = this.transformDefinitionsInterface(props.$ref);
      if (!isNormal) {
        this.addValue(
          interfaceImport,
          isEnum ? 'common.enum' : 'common.d',
          name
        );
      }
      return name;
    } else if (props.properties) {
      return `{
        ${this.traverseObject(
          props.properties,
          enumBuffer,
          interfaceImport,
          [],
          isCommon
        )}
      }`;
    } else if (props.additionalProperties) {
      if (
        Object.keys(this.typeDictionary).includes(
          props.additionalProperties.type
        )
      ) {
        return `{
          [key: string]: ${
            this.typeDictionary[props.additionalProperties.type]
          };
        }`;
      } else if (props.additionalProperties.type === 'array') {
        return `{
          [key: string]: ${this.getTypeFromArray(
            props.additionalProperties,
            interfaceImport,
            enumBuffer,
            isCommon
          )};
        }`;
      } else if (props.additionalProperties.type === 'object') {
        return `{
          [key: string]: ${this.getTypeFromObject(
            props.additionalProperties,
            enumBuffer,
            interfaceImport,
            isCommon
          )};
        }`;
      } else {
        console.log(props);
        console.log('find a type feel me bad......');
        return `{
          [key: string]: any
        }`;
      }
    } else {
      throw new Error('core: getTypeFromObject: un know type');
    }
  }

  private addValue(map: Map<string, string[]>, key: string, value: string) {
    if (!map.has(key)) {
      map.set(key, [value]);
    } else if (map.has(key) && !map.get(key).includes(value)) {
      map.get(key).push(value);
    }
  }

  private addSpecialContentInEnumFile() {
    this.enumBuffer = `
      /* tslint:disable no-duplicate-string */
      ${this.enumBuffer}
    `;
  }
}

export default Core;
