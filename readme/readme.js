'use strict';

const fs = require('fs');
console.log('fs', fs);

const basic       = require('../build/basic');
const conversions = require('../build/conversions');
const dateTime    = require('../build/date-time');
const primitives  = require('../build/primitives');
const objects     = require('../build/objects');
const sql         = require('../build/sql');

const allFiles = Object.assign({},
  {
    basic: basic,
    conversions: conversions,
    dateTime: dateTime,
    primitives: primitives,
    objects: objects,
    sql: sql,
  }
);

const allFunctions = {};

for(let file in allFiles){
  allFunctions[file] = {};
  for(let fn in allFiles[file]){
    allFunctions[file][fn] = true ;
  }
}

const asString = JSON.stringify(allFunctions);
const noQuotes = asString.split('\"').join('');
const lineOpen = noQuotes.split('{').join('{\n');
const lineClose = lineOpen.split('}').join('\n}');
const lineComma = lineClose.split(',').join(',\n');
const theString = `'use strict';\n\nconst allFunctions = ${lineComma};\n\n module.exports = {\nallFunctions\n};`;

fs.writeFile('readme/all-functions.js', theString, function (err) {
  if (err) throw err;
  console.log('Saved!');
});