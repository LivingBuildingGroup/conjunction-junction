'use strict';

const { isPrimitiveNumber, 
  isObjectLiteral } = require('./basic');

const asArray = x => {
  if(Array.isArray(x)){
    return x;
  }
  return [];
};

const asObject = x => {
  if(isObjectLiteral(x)){
    return x;
  }
  return {};
};

const asFunction = x => {
  if(typeof x === 'function'){
    return x;
  }
  return ()=>{};
};

module.exports = {
  asArray,
  asObject,
  asFunction,
};