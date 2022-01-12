const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
let version = '';
let branch = child_process.execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8',
});
let commitId = child_process.execSync('git rev-parse --short HEAD', {
  encoding: 'utf8',
});
version = `${branch.split('\n')[0]}   ${commitId.split('\n')[0]}`;
const filePath = path.resolve(process.cwd(), './src/scripts/version.ts');

const command = `export const UI_VERSION="${version}"`;
fs.writeFileSync(filePath, command);
