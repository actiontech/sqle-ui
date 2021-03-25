import { ISwaggerJson } from '../json/index.d';
import { PluginInstance } from '../types/plugin';
import * as fs from 'fs';
import * as path from 'path';

class Plugin {
  private plugin: PluginInstance[] = [];

  public runPlugin(
    pluginName: 'swaggerJson',
    swaggerJson: string
  ): ISwaggerJson;
  public runPlugin(pluginName: string, ...params: any[]): any {
    let res = undefined;
    for (const p of this.plugin) {
      if (!!p[pluginName]) {
        res = p[pluginName](...params, res);
      }
    }
    return res;
  }

  public registerPlugin(pluginPath: string) {
    const realPath = path.resolve(process.cwd(), pluginPath);
    if (!fs.existsSync(realPath)) {
      console.warn(`not find plugin file by ${realPath}`);
      return;
    }
    let plugin = require(realPath);
    if (!Array.isArray(plugin)) {
      plugin = [plugin];
    }
    this.plugin = this.plugin.concat(plugin);
  }
}

export default new Plugin();
