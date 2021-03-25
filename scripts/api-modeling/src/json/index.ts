import * as fs from 'fs';
import BaseClass from '../common/BaseClass';
import CommonData from '../common/Data';
import { ISwaggerJson, ISwaggerPaths } from './index.d';

class Json extends BaseClass{

  public getApiData (swaggerJsonSrc: string) {
    console.log(`start generate api data from swagger.json...`);
    const swaggerObj = this.handleSwaggerJsonFile(swaggerJsonSrc);
    // const set = new Set();
    // Object.keys(swaggerObj.definitions).forEach(e => {
    //   const currentApi = swaggerObj.definitions[e];
    //   if (currentApi.type !== 'object') {
    //     console.log(e);
    //     set.add(currentApi.type);
    //   }
    // })
    // console.log(set);
    const definitions = swaggerObj.definitions;
    const parameters = swaggerObj.parameters;
    const apiMap = this.generateApiMap(swaggerObj);
    console.log(`generate api data end`)
    return {
      definitions,
      apiMap,
      parameters
    }
  }

  public handleSwaggerJsonFile (swaggerJsonSrc: string): ISwaggerJson {
    console.log(`start read swagger.json...;current src of find: ${swaggerJsonSrc}`)
    const swaggerJson = fs.readFileSync(swaggerJsonSrc);
    console.log(`read swagger.json end`);
    let json = this.plugin.runPlugin('swaggerJson', swaggerJson.toString());
    if (!json) {
      json = JSON.parse(swaggerJson.toString());
    }
    return json;
  }

  public generateApiMap (swaggerJson: ISwaggerJson): Map<string, ISwaggerPaths[]> {
    console.log(`start classification process api...`)
    const apiMap = new Map<string, ISwaggerPaths[]>();
    const paths = Object.keys(swaggerJson.paths);
    paths.forEach(path => {
      const currentApi = swaggerJson.paths[path];
      const keys = Object.keys(currentApi);
      for (let i = 0; i < keys.length; i++) {
        const apiMethod = keys[i];
        if (CommonData.RequestMethod.includes(apiMethod)) {
          if (!currentApi[apiMethod].tags) {
            throw new Error(`Json: generateApiMap: there are no tags in api ${path}:${currentApi}:${apiMethod}`);
          }
          const currentTag = currentApi[apiMethod].tags[0];
          if (apiMap.has(currentTag)) {
            apiMap.get(currentTag).push({ [path]: currentApi });
          } else {
            apiMap.set(currentTag, [{[path]: currentApi}]);
          }
          break;
        }
      }
    })
    console.log(`classification process api end`)
    return apiMap;
  }

}

export default new Json();
