const config = require('../config/envConfig');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const core_1 = require('../dist/core');

const core = new core_1.default(
  path.resolve(__dirname, '../swagger.json'),
  path.resolve(__dirname, '../../../src/api')
);

let branch = '1.3.0';

const branchArgv = process.argv.find(
  (e) =>
    e.indexOf('branch=') > -1 ||
    e.indexOf('tag=') > -1 ||
    e.indexOf('commit=') > -1
);

if (branchArgv) {
  branch = branchArgv.split('=')[1];
}

axios
  .get(
    `http://10.186.18.21/api/v4/projects/234/repository/files/sqle%2Fdocs%2Fswagger.json/raw?ref=${branch}`,
    {
      headers: {
        'PRIVATE-TOKEN': config.access_token,
      },
    }
  )
  .then((res) => {
    fs.writeFile(
      path.resolve(__dirname, '../swagger.json'),
      JSON.stringify(res.data),
      function(err, data) {
        if (err) {
          console.log(err);
        } else {
          core.generateApi();
        }
      }
    );
  })
  .catch((err) => {
    console.log(err, '获取文件失败！');
  });
