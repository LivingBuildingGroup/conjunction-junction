'use strict';

const { isObjectLiteral, isPrimitiveNumber } = require('./basic');

const asArray = x => {
  if(Array.isArray(x)){
    return x;
  }
  return [];
};

const asObject = (x, copy) => {
  if(isObjectLiteral(x)){
    if(copy === 'deep'){
      return JSON.parse(JSON.stringify(x));
    } else if(copy === 'shallow'){
      return Object.assign({}, x);
    }
    return x;
  }
  return {};
};

const asFunction = x => {
  if(typeof x === 'function'){
    return x;
  }
  return ()=>{console.warn('no function provided')};
};

const asString = (x, def) => {
  if(typeof x === 'string'){
    return x;
  }
  return typeof def === 'string' ? def : '';
};

const asBoolean = (x, def) => {
  if(typeof x === 'boolean'){
    return x;
  }
  return !!def;
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
  asBoolean,
  asNumber,
};