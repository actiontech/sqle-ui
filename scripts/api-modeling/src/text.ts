import * as fs from 'fs';

const file = fs.readFileSync('../test.txt');

const data = file.toString().split('\n');

const set = new Set();

data.forEach(e => {
  const str = e.match(/\(.*\)/)[0];
  set.add(str.slice(1, str.length - 1))
})

console.log(Array.from(set));
