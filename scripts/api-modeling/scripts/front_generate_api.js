const fs = require('fs');
const path = require('path');
const core_1 = require('../dist/core');
const { Octokit } = require('@octokit/core');

const argv = process.argv;

let token = argv.find((item) => item.startsWith('-token='));

if (!token) {
  throw new Error('Token is required');
}

token = token.split('=')[1];

const octokit = new Octokit({
  auth: token,
});

const core = new core_1.default(
  path.resolve(__dirname, '../swagger.json'),
  path.resolve(__dirname, '../../../src/api')
);

let branch = 'main-ee';

const branchArgv = process.argv.find(
  (e) =>
    e.indexOf('branch=') > -1 ||
    e.indexOf('tag=') > -1 ||
    e.indexOf('commit=') > -1
);

if (branchArgv) {
  branch = branchArgv.split('=')[1];
}
const getFile = async () => {
  try {
    const value = await octokit.request(
      `GET /repos/{owner}/{repo}/contents/{path}?ref=${branch}`,
      {
        owner: 'actiontech',
        repo: 'sqle-ee',
        path: `/sqle/docs/swagger.json`,
      }
    );

    fs.writeFile(
      path.resolve(__dirname, '../swagger.json'),
      Buffer.from(value.data.content, 'base64').toString(),
      function(err, data) {
        if (err) {
          console.log(err);
        } else {
          core.generateApi();
        }
      }
    );
  } catch (error) {
    console.error('get swagger.json error', error);
  }
};

getFile();
