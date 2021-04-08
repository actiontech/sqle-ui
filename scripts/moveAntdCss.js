const path = require('path');
const fs = require('fs');

const cwd = process.cwd();

const antdStyle = path.resolve(cwd, './node_modules/antd/dist');
const lightCss = path.resolve(antdStyle, './antd.min.css');
const lightCssMap = path.resolve(antdStyle, './antd.min.css.map');
const darkCss = path.resolve(antdStyle, './antd.dark.min.css');
const darkCssMap = path.resolve(antdStyle, './antd.dark.min.css.map');

const publicPath = path.resolve(cwd, './public/static/css');

const pathSet = [lightCss, lightCssMap, darkCss, darkCssMap, publicPath];

for (const p of pathSet) {
  if (!fs.existsSync(p)) {
    console.error(`not find file by ${p}`);
    process.exit(1);
  }
}

fs.copyFileSync(lightCss, `${publicPath}/antd.min.css`);
fs.copyFileSync(lightCssMap, `${publicPath}/antd.min.css.map`);
fs.copyFileSync(darkCss, `${publicPath}/antd.dark.min.css`);
fs.copyFileSync(darkCssMap, `${publicPath}/antd.dark.min.css.map`);
