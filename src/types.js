'use strict';

const { isObjectLiteral, isPrimitiveNumber } = require('./basic');

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

const asString = x => {
  if(typeof x === 'string'){
    return x;
  }
  return '';
};

const asNumber = (x, def) => {
  if(typeof def === 'undefined'){
    console.warn('please specify a default value when using asNumber')
  }
  if(isPrimitiveNumber(x)){
    return x;
  }
  return def;
};

module.exports = {
  asArray,
  asObject,
  asFunction,
  asString,
  asNumber,
};