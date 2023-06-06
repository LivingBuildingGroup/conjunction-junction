'use strict';

const basic       = require('./build/basic');
const conversions = require('./build/conversions');
const dateTime    = require('./build/date-time');
const primitives  = require('./build/primitives');
const objects     = require('./build/objects');
const sql         = require('./build/sql');
const colors      = require('./build/colors');
const svgs        = require('./build/svgs');
const types       = require('./build/types');

module.exports = Object.assign({},
  basic,
  conversions,
  dateTime,
  primitives,
  objects,
  sql,
  colors,
  svgs,
  types,
);