import { ISwaggerJson } from "../json/index.d";

export type PluginInstance = {
  swaggerJson: (swaggerJson: string, prevPluginRes: ISwaggerJson) => ISwaggerJson;
}
