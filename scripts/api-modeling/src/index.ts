import Core from './core';
import * as path from 'path';

const core = new Core(
  path.resolve(__dirname, '../swagger.json'),
  path.resolve(__dirname, '../../../src/api'),
  // path.resolve(__dirname, './api')
  // 'E:/umc/src/umc/newfe/src/api'
);

core.generateApi();
